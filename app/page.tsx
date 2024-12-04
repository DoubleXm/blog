import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allNotes } from 'contentlayer/generated'
import Main from './Main'

export default async function Page() {
  const sortedPosts = sortPosts(allNotes)
  const posts = allCoreContent(sortedPosts)
  return <Main posts={posts} />
}
