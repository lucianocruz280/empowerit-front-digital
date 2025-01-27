
type Props = {
  lesson: any;
}

const VideoDescription = (props: Props) => {
  const { lesson } = props;
  return (
    <div className="flex flex-col w-full text-left px-4 py-8 space-y-[8px]">
        <h5>{ lesson.name }</h5>
        <p>{ lesson.description || ""}</p>
    </div>
  )
}

export default VideoDescription