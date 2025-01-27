import { useState } from 'react'
import Tabs from '@/components/ui/Tabs'
import LeadershipAcademyCourses from './components/LeadershipCourses'
import AcademyCalendarView from './components/CalendarView'

const { TabNav, TabList, TabContent } = Tabs

const ControlledTabs = () => {
  const [currentTab, setCurrentTab] = useState('tab1')

  return (
    <div>
      <Tabs value={currentTab} onChange={(val) => setCurrentTab(val)}>
        <TabList>
          <TabNav value="tab1">Academia</TabNav>
          <TabNav value="tab2">Calendario</TabNav>
        </TabList>
        <div className="p-4">
          <TabContent value="tab1">
            <LeadershipAcademyCourses />
          </TabContent>
          <TabContent value="tab2">
            <AcademyCalendarView />
          </TabContent>
        </div>
      </Tabs>
    </div>
  )
}

export default ControlledTabs
