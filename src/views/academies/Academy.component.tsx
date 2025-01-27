import { useState } from 'react'
import Tabs from '@/components/ui/Tabs'
import AcademyCoursesList from './previews/AcademyCoursesList.component'

const { TabNav, TabList, TabContent } = Tabs

const AcademyControlledTabs = () => {
  const [currentTab, setCurrentTab] = useState('tab1')

  return (
    <div>
      <Tabs value={currentTab} onChange={(val) => setCurrentTab(val)}>
        <TabList>
          <TabNav value="tab1">Academia</TabNav>
          {/* <TabNav value="tab2">Calendario</TabNav> */}
        </TabList>
        <div className="p-4">
          <TabContent value="tab1">
            <AcademyCoursesList isLeadership={false} isEditable={false}  />
          </TabContent>
          {/* <TabContent value="tab2">
            <AcademyCalendarView />
          </TabContent> */}
        </div>
      </Tabs>
    </div>
  )
}

export default AcademyControlledTabs