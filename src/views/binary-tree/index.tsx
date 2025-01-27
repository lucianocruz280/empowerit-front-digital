import { db } from '@/configs/firebaseConfig'
import { useAppSelector } from '@/store'
import {
  collection,
  getDocs,
  where,
  query,
  getDoc,
  doc,
  orderBy,
} from 'firebase/firestore'
import { useEffect, useState, forwardRef, useCallback } from 'react'
import { Avatar, Button, Dialog } from '@/components/ui'
import { HiOutlineUser } from 'react-icons/hi'
import classNames from 'classnames'
import arrowCreate, { DIRECTION } from 'arrows-svg'
import { getRestDaysMembership } from '@/utils/membership'
import { FaChevronUp } from 'react-icons/fa'
import useQuery from '@/utils/hooks/useQuery'
import dayjs from 'dayjs'

class Node {
  data: any
  left: any
  right: any

  constructor(data: any) {
    this.data = data
    this.left = null
    this.right = null
  }
}

async function buildTreeFromFirestore(collectionName: string, rootId: string) {
  const snapshot = await getDocs(collection(db, collectionName))

  const docs: any = {}
  snapshot.forEach((doc: any) => {
    docs[doc.id] = { id: doc.id, ...doc.data() }
  })

  const nodes: any = {}
  let rootDocId = rootId
  let rootNode = null

  for (const [docId, docData] of Object.entries(docs)) {
    nodes[docId] = new Node(docData)
    if (rootDocId === null) {
      rootDocId = docId
    }
  }

  rootNode = nodes[rootDocId as string]
  const queue = [rootNode]

  let depth = 0

  while (queue.length > 0) {
    depth++
    const node = queue.shift()
    const docData = node.data
    const leftDocId = docData.left_binary_user_id
    const rightDocId = docData.right_binary_user_id

    if (leftDocId && nodes[leftDocId]) {
      node.left = nodes[leftDocId]
      queue.push(node.left)
    }
    if (rightDocId && nodes[rightDocId]) {
      node.right = nodes[rightDocId]
      queue.push(node.right)
    }

    if (depth == 3) break
  }

  return rootNode
}

const getTreeNode = (node: any): any => {
  if (!node) return {}

  return {
    name: node.data?.name,
    children:
      node.left || node.right
        ? [getTreeNode(node.left), getTreeNode(node.right)]
        : [],
  }
}

const NodeAvatar = forwardRef(
  (
    {
      id,
      name,
      email,
      avatar,
      x,
      y,
      size,
      onClick,
      membership_expires_at,
      membership,
    }: any,
    ref: any
  ) => {
    const days = getRestDaysMembership(membership_expires_at)
    return (
      <div
        className={classNames(`absolute border rounded-lg h-[180px] py-4`, {
          'px-8 w-[200px]': size == 's',
          'px-16 w-[300px]': size != 's',
          'hover:bg-gray-100 hover:cursor-pointer border-solid shadow-md border-gray-400':
            Boolean(name),
          'border-dashed border-gray-300': !name,
          'shadow-supreme/50': membership == 'supreme',
          'shadow-pro/60': membership == 'pro',
          'shadow-vip-pack/80': membership == 'vip-pack',
          'shadow-elite-pack/60': membership == 'elite-pack',
          'shadow-alive-pack/60': membership == 'alive-pack',
          'shadow-freedom-pack/60': membership == 'freedom-pack',
          'shadow-business-pack/60': membership == 'business-pack',
        })}
        style={{
          left: x,
          top: y,
          boxShadow: ['vip-pack', 'elite-pack'].includes(membership)
            ? 'var(--tw-shadow-color) 0px -50px 36px -28px inset'
            : 'var(--tw-shadow-color) 0px 15px 20px -10px',
        }}
        id={id}
        ref={ref}
        onClick={onClick}
      >
        <img
          src="/img/logo3/logo-dark-streamline.png"
          className="absolute left-1/2 top-1/2 -translate-y-1/2 w-full -translate-x-1/2 opacity-5"
        />
        <div className="relative flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar
              size={80}
              shape="circle"
              icon={<HiOutlineUser />}
              src={avatar}
              className={classNames({
                'bg-white border border-dashed border-gray-300 text-gray-300':
                  !name,
              })}
            />
            {days > 0 ? (
              <div className="absolute right-0 bottom-0 translate-x-1/2 bg-indigo-600 text-white rounded-lg px-1 py-1 text-xs">
                {days} días
              </div>
            ) : name ? null : null}
          </div>
          {name && (
            <div>
              <span className="flex flex-col items-center">
                <span className="text-xl font-bold whitespace-nowrap line-clamp-1">
                  {name}
                </span>
                <span className="text-center">
                  Socio <span className="whitespace-nowrap">EMPOWERIT TOP</span>
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }
)
NodeAvatar.displayName = 'NodeAvatar'

export default function OrgChartTree() {
  const queryParams = useQuery()
  const [tree, setTree] = useState<any>(null)
  const user = useAppSelector((state) => state.auth.user)
  const [rootNodeId, setRootNodeId] = useState(
    queryParams.get('userID') ? queryParams.get('userID') : user.uid
  )
  const [leftPoints, setLeftPoints] = useState<any[]>([])
  const [rightPoints, setRightPoints] = useState<any[]>([])
  const [arrowsSetted, setArrows] = useState(false)
  const [openModal, setOpenModal] = useState<null | string>(null)

  useEffect(() => {
    if (rootNodeId) {
      buildTreeFromFirestore('users', rootNodeId)
        .then((rootNode) => {
          //console.log('Tree built successfully!', rootNode)
          console.log(
            rootNode?.data.id,
            dayjs(rootNode?.data.created_at.seconds * 1000).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          )
          setTree(rootNode)
        })
        .catch((err) => {
          console.error('Failed to build tree:', err)
        })
    }
  }, [rootNodeId])

  const containerWidth = 1200

  const initPosition = 600 - 150

  const renderarrow = useCallback(() => {
    const head = {
      func: () => {
        return {
          node: '<rect x="-10" y="-10" width="20" height="25" style="display: none" />',
          width: 1,
          height: 1,
        }
      },
    }

    const wrapper = document.querySelector('#treeWrapper')

    const nodemain = document.querySelector('#node-main')
    const left = document.querySelector('#left')
    const right = document.querySelector('#right')
    const left_left = document.querySelector('#left-left')
    const left_right = document.querySelector('#left-right')
    const right_left = document.querySelector('#right-left')
    const right_right = document.querySelector('#right-right')

    if (wrapper && nodemain && !arrowsSetted) {
      setArrows(true)
      const arrow1 = arrowCreate({
        head,
        from: {
          node: nodemain,
          direction: DIRECTION.LEFT,
        },
        to: {
          node: left,
          direction: DIRECTION.TOP,
        },
      })
      wrapper.appendChild(arrow1.node)

      const arrow2 = arrowCreate({
        head,
        from: {
          node: nodemain,
          direction: DIRECTION.RIGHT,
        },
        to: {
          node: right,
          direction: DIRECTION.TOP,
        },
      })
      wrapper.appendChild(arrow2.node)

      const arrow3 = arrowCreate({
        head,
        from: {
          node: left,
          direction: DIRECTION.BOTTOM,
        },
        to: {
          node: left_left,
          direction: DIRECTION.TOP,
        },
      })
      wrapper.appendChild(arrow3.node)

      const arrow4 = arrowCreate({
        head,
        from: {
          node: left,
          direction: DIRECTION.BOTTOM,
        },
        to: {
          node: left_right,
          direction: DIRECTION.TOP,
        },
      })
      wrapper.appendChild(arrow4.node)

      const arrow5 = arrowCreate({
        head,
        from: {
          node: right,
          direction: DIRECTION.BOTTOM,
        },
        to: {
          node: right_left,
          direction: DIRECTION.TOP,
        },
      })
      wrapper.appendChild(arrow5.node)

      const arrow6 = arrowCreate({
        head,
        from: {
          node: right,
          direction: DIRECTION.BOTTOM,
        },
        to: {
          node: right_right,
          direction: DIRECTION.TOP,
        },
      })
      wrapper.appendChild(arrow6.node)
    }
  }, [])

  useEffect(() => {
    getPoints()
  }, [user.uid])

  const getPoints = async () => {
    if (!user || !user.uid) return
    const docs = await getDocs(
      query(
        collection(db, `users/${user.uid}/points`),
        where('created_at', '>=', dayjs().startOf('month').toDate())
      )
    )
    /* const left = await Promise.all(
      docs.docs
        .filter((r) => r.get('side') == 'left')
        .map(async (r) => ({
          ...r.data(),
          created_at: dayjs(r.get('created_at').seconds * 1000).format(
            'YYYY-MM-DD HH:mm:ss'
          ),
        }))
    ) */
    /* const right = await Promise.all(
      docs.docs
        .filter((r) => r.get('side') == 'right')
        .map(async (r) => ({
          ...r.data(),
          created_at: dayjs(r.get('created_at').seconds * 1000).format(
            'YYYY-MM-DD HH:mm:ss'
          ),
        }))
    ) */
    const left = []
    const leftSnapshot = await getDocs(
      query(
        collection(db, `users/${user.uid}/left-points`),
        where('expires_at', '>=', new Date()),
        orderBy('expires_at', 'desc')
      )
    )
    for (const docu of leftSnapshot.docs) {
      left.push(docu.data())
    }
    const right = []
    const rightSnapshot = await getDocs(
      query(
        collection(db, 'users', user.uid, 'right-points'),
        where('expires_at', '>=', new Date()),
        orderBy('expires_at', 'desc')
      )
    )
    for (const docu of rightSnapshot.docs) {
      right.push(docu.data())
    }

    setLeftPoints(left)
    setRightPoints(right)
  }

  const showLeft = async () => {
    if (user.uid == rootNodeId) {
      setOpenModal('left')
    }
  }

  const showRight = async () => {
    if (user.uid == rootNodeId) {
      setOpenModal('right')
    }
  }

  const closeModal = () => {
    setOpenModal(null)
  }

  if (!tree) return null

  return (
    <div id="treeWrapper" className="w-full h-full overflow-auto">
      <Dialog
        isOpen={openModal !== null}
        width={1000}
        closable={true}
        onClose={closeModal}
      >
        <table className="w-full">
          <thead>
            <tr>
              <th>Puntos</th>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Patrocinador</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {openModal == 'left' &&
              leftPoints.map((r, index) => (
                <tr key={index}>
                  <td className="text-center">{r.points}</td>
                  <td className="text-center">{r.name}</td>
                  <td className="text-center">{r.user_email}</td>
                  <td className="text-center">{r.user_sponsor}</td>
                  <td className="text-center">
                    {dayjs(r.starts_at.toDate()).format('YYYY-MM-DD HH:mm:ss')}
                  </td>
                </tr>
              ))}
            {openModal == 'right' &&
              rightPoints.map((r, index) => (
                <tr key={index}>
                  <td className="text-center">{r.points}</td>
                  <td className="text-center">{r.name}</td>
                  <td className="text-center">{r.user_email}</td>
                  <td className="text-center">{r.user_sponsor}</td>
                  <td className="text-center">
                    {dayjs(r.starts_at.toDate()).format('YYYY-MM-DD HH:mm:ss')}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Dialog>

      <div
        className="relative"
        style={{ width: containerWidth, paddingBottom: 40 }}
      >
        {rootNodeId != user.uid && (
          <>
            <div className="absolute left-1 top-1">
              <Button onClick={() => setRootNodeId(user.uid)}>Inicio</Button>
            </div>
            <div className="absolute left-1 top-14">
              <Button
                onClick={() => setRootNodeId(tree.data.parent_binary_user_id)}
              >
                <FaChevronUp />
              </Button>
            </div>
          </>
        )}

        {
          <>
            <div
              className="absolute"
              style={{ left: initPosition - 100, top: 10 }}
            >
              <button onClick={showLeft}>
                <b>Izq: {tree?.data?.left_points} pts</b>
              </button>
            </div>
            <div
              className="absolute"
              style={{ left: initPosition + 320, top: 10 }}
            >
              <button onClick={showRight}>
                <b>Der: {tree?.data?.right_points} pts</b>
              </button>
            </div>
          </>
        }
        <NodeAvatar
          {...tree.data}
          id="node-main"
          x={initPosition}
          y={10}
          ref={renderarrow}
        />

        <>
          {tree.left ? (
            <NodeAvatar
              {...tree.left.data}
              id="left"
              x={initPosition - 300}
              y={220}
              onClick={() => setRootNodeId(tree.left.data.id)}
            />
          ) : (
            <NodeAvatar id="left" x={initPosition - 300} y={220} />
          )}
          {tree.right ? (
            <NodeAvatar
              {...tree.right.data}
              id="right"
              x={initPosition + 300}
              y={220}
              onClick={() => setRootNodeId(tree.right.data.id)}
            />
          ) : (
            <NodeAvatar id="right" x={initPosition + 300} y={220} />
          )}
        </>

        <>
          {tree.left?.left ? (
            <NodeAvatar
              {...tree.left.left.data}
              id="left-left"
              x={initPosition - 380}
              y={450}
              size="s"
              onClick={() => setRootNodeId(tree.left.left.data.id)}
            />
          ) : (
            <NodeAvatar
              id="left-left"
              x={initPosition - 380}
              y={450}
              size="s"
            />
          )}
          {tree.left?.right ? (
            <NodeAvatar
              {...tree.left.right.data}
              id="left-right"
              x={initPosition - 120}
              y={450}
              size="s"
              onClick={() => setRootNodeId(tree.left.right.data.id)}
            />
          ) : (
            <NodeAvatar
              id="left-right"
              x={initPosition - 120}
              y={450}
              size="s"
            />
          )}

          {tree.right?.left ? (
            <NodeAvatar
              {...tree.right.left.data}
              id="right-left"
              x={initPosition + 230}
              y={450}
              size="s"
              onClick={() => setRootNodeId(tree.right.left.data.id)}
            />
          ) : (
            <NodeAvatar
              id="right-left"
              x={initPosition + 230}
              y={450}
              size="s"
            />
          )}
          {tree.right?.right ? (
            <NodeAvatar
              {...tree.right.right.data}
              id="right-right"
              x={initPosition + 490}
              y={450}
              size="s"
              onClick={() => setRootNodeId(tree.right.right.data.id)}
            />
          ) : (
            <NodeAvatar
              id="right-right"
              x={initPosition + 490}
              y={450}
              size="s"
            />
          )}
        </>
      </div>
    </div>
  )
}
