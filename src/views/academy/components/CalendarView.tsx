import CalendarView from '@/components/shared/CalendarView'

const AcademyCalendarView = () => {
  const eventsData: any[] = []

  return (
    <CalendarView
      events={eventsData}
      eventClick={(arg) => {
        console.log('onEventClick', arg)
      }}
      select={(event) => {
        console.log('onCellSelect', event)
      }}
      eventDrop={(arg) => {
        console.log('onEventChange', arg)
      }}
      locale={"es"}
    />
  )
}

export default AcademyCalendarView
