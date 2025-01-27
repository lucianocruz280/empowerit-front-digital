import { useState } from 'react'
import Tabs from '@/components/ui/Tabs'
import AcademyCoursesList from '../previews/AcademyCoursesList.component'

const { TabNav, TabList, TabContent } = Tabs

const AdminAcademyLeadershipControlledTabs = () => {
  const [currentTab, setCurrentTab] = useState('tab1')

  return (
    <div>
      <Tabs value={currentTab} onChange={(val) => setCurrentTab(val)}>
        <TabList>
          <TabNav value="tab1">Academia de Liderazgo - Administrador</TabNav>
        </TabList>
        <div className="p-4">
          <TabContent value="tab1">
            <AcademyCoursesList isEditable isLeadership={true} />
          </TabContent>
        </div>
      </Tabs>
    </div>
  )
}

export default AdminAcademyLeadershipControlledTabs