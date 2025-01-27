export type Course = {
  id: string
  count_lesson: number
  count_likes: number
  count_views: number
  created_at: {
    seconds: number
  }
  description: string
  ends_at: {
    seconds: number
  }
  id_category: string
  image_cover: string
  name: string
  starts_at: {
    seconds: number
  }
  status: 'in_progress' | 'archived'
  updated_at: {
    seconds: number
  }
}

export type Lesson = {
  id: string
  cloudflare_live_key: string
  count_likes: number
  count_views: number
  played_seconds?: number
  course_id?: string
  created_at: {
    seconds: number
  }
  description: string
  image_cover: string
  record_link: string
  live_link: string
  name: string
  order: number
  duration?: string
  scheduled_at: {
    seconds: number
  }
  status: 'scheduled' | 'live' | 'transmitted'
  updated_at: {
    seconds: number
  }
  author: {
    name: string
    image: string
  }
}

export type Live = {
  id: string
  created_at: {
    seconds: number
  }
  description: string
  duration: string
  image_cover: string
  record_link: string
  count_views: number
  played_seconds?: number
  order: number
  date: {
    seconds: number
  }
  updated_at: {
    seconds: number
  }
  course_id?: string
}
