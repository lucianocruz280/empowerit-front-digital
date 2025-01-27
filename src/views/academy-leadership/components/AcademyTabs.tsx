import { useState } from 'react'
import Tabs from '@/components/ui/Tabs'

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
            <p>
              If builders built buildings the way programmers wrote programs,
              then the first woodpecker that came along would destroy
              civilization. (Gerald Weinberg)
            </p>
          </TabContent>
          <TabContent value="tab2">
            <p>
              A computer lets you make more mistakes faster than any invention
              in human history with the possible exceptions of handguns and
              tequila. (Mitch Radcliffe).
            </p>
          </TabContent>
        </div>
      </Tabs>
    </div>
  )
}

export default ControlledTabs
