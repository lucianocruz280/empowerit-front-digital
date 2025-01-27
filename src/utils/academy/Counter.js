/*
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { v4 } from 'uuid'

import {
  collection,
  doc,
  setDoc,
  increment,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '@/configs/firebaseConfig'

const SHARD_COLLECTION_ID = '_counter_shards_'

export class Counter {
  /**
   * Constructs a sharded counter object that references to a field
   * in a document that is a counter.
   *
   * @param doc A reference to a document with a counter field.
   * @param field A path to a counter field in the above document.
   */
  constructor(refDoc, field) {
    this.shards = {}
    this.notifyPromise = null
    this.doc = refDoc
    this.field = field
    this.db = refDoc.firestore
    this.shardId = getShardId()

    const shardsRef = collection(db, this.doc.path, SHARD_COLLECTION_ID)
    this.shards[this.doc.path] = 0
    this.shards[doc(db, shardsRef.path, this.shardId).path] = 0
    this.shards[
      doc(db, shardsRef.path, '\t' + this.shardId.slice(0, 4)).path
    ] = 0
    this.shards[
      doc(db, shardsRef.path, '\t\t' + this.shardId.slice(0, 3)).path
    ] = 0
    this.shards[
      doc(db, shardsRef.path, '\t\t\t' + this.shardId.slice(0, 2)).path
    ] = 0
    this.shards[
      doc(db, shardsRef.path, '\t\t\t\t' + this.shardId.slice(0, 1)).path
    ] = 0
  }

  /**
   * Get latency compensated view of the counter.
   *
   * All local increments will be reflected in the counter even if the main
   * counter hasn't been updated yet.
   */
  async get(options) {
    const valuePromises = Object.keys(this.shards).map(async (path) => {
      const shard = await this.db.doc(path).get(options)
      return shard.get(this.field) || 0
    })
    const values = await Promise.all(valuePromises)
    return values.reduce((a, b) => a + b, 0)
  }

  /**
   * Listen to latency compensated view of the counter.
   *
   * All local increments to this counter will be immediately visible in the
   * snapshot.
   */
  onSnapshot(observable) {
    Object.keys(this.shards).forEach((path) => {
      onSnapshot(doc(this.db, path), (snap) => {
        this.shards[snap.ref.path] = snap.get(this.field) || 0
        if (this.notifyPromise !== null) return
        this.notifyPromise = schedule(() => {
          const sum = Object.values(this.shards).reduce((a, b) => a + b, 0)
          observable({
            exists: true,
            data: () => sum,
          })
          this.notifyPromise = null
        })
      })
    })
  }

  /**
   * Increment the counter by a given value.
   *
   * e.g.
   * const counter = new sharded.Counter(db.doc("path/document"), "counter");
   * counter.incrementBy(1);
   */
  incrementBy(val) {
    const _increment = increment(val)
    const update = this.field
      .split('.')
      .reverse()
      .reduce((value, name) => ({ [name]: value }), _increment)

    const _doc = doc(db, this.doc.path, SHARD_COLLECTION_ID, this.shardId)
    return setDoc(_doc, update, { merge: true })
  }

  decreaseBy(val) {
    const _increment = increment(val * -1)
    const update = this.field
      .split('.')
      .reverse()
      .reduce((value, name) => ({ [name]: value }), _increment)

    const _doc = doc(db, this.doc.path, SHARD_COLLECTION_ID, this.shardId)
    return setDoc(_doc, update, { merge: true })
  }

  /**
   * Access the assigned shard directly. Useful to update multiple counters
   * at the same time, batches or transactions.
   *
   * e.g.
   * const counter = new sharded.Counter(db.doc("path/counter"), "");
   * const shardRef = counter.shard();
   * shardRef.set({"counter1", firestore.FieldValue.Increment(1),
   *               "counter2", firestore.FieldValue.Increment(1));
   */
  shard() {
    return this.doc.collection(SHARD_COLLECTION_ID).doc(this.shardId)
  }
}

async function schedule(func) {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const result = func()
      resolve(result)
    }, 0)
  })
}

function getShardId() {
  const shardId = v4()
  return shardId
}
