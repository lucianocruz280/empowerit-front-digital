import {
  HiOutlineColorSwatch,
  HiOutlineDesktopComputer,
  HiOutlineTemplate,
  HiOutlineViewGridAdd,
  HiOutlineHome,
  HiOutlineAcademicCap,
  HiOutlinePencil,
} from 'react-icons/hi'
import { AiOutlineDashboard } from 'react-icons/ai'
import {
  BsAirplane,
  BsBarChartLine,
  BsBezier,
  BsFillAwardFill,
  BsTools,
  BsTrophy,
  BsPeople,
  BsShield,
} from 'react-icons/bs'
import { TbBinaryTree } from 'react-icons/tb'
import {
  FaCrown,
  FaHistory,
  FaMoneyBill,
  FaPeopleArrows,
  FaStore,
  FaVideo,
  FaMedal,
  FaRegMap,
} from 'react-icons/fa'
import { FaNetworkWired } from 'react-icons/fa6'
import { PiPackage } from 'react-icons/pi'
import { GiCoins } from 'react-icons/gi'
import { GiDiploma } from 'react-icons/gi'
import { SiThealgorithms } from 'react-icons/si'
import { MdApartment } from 'react-icons/md'
import { IoBusiness } from 'react-icons/io5'
import { LiaCoinsSolid } from 'react-icons/lia'
import { FaShopLock } from 'react-icons/fa6'
import { GiBull } from 'react-icons/gi'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
  home: <HiOutlineHome />,
  singleMenu: <HiOutlineViewGridAdd />,
  collapseMenu: <HiOutlineTemplate />,
  groupSingleMenu: <HiOutlineDesktopComputer />,
  groupCollapseMenu: <HiOutlineColorSwatch />,
  sales: <AiOutlineDashboard />,
  academy: <HiOutlineAcademicCap />,
  pencil: <HiOutlinePencil />,
  'direct-people': <FaNetworkWired fontSize={18} />,
  pack: <PiPackage />,
  binary: <TbBinaryTree />,
  trophy: <BsFillAwardFill />,
  marketplace: <FaStore />,
  retiro: <BsAirplane />,
  history: <FaHistory />,
  leader: <FaCrown />,
  supreme: <BsTrophy />,
  tools: <BsTools />,
  system: <BsBarChartLine />,
  payroll: <FaMoneyBill />,
  users: <BsPeople />,
  videos: <FaVideo />,
  rank: <FaMedal />,
  map: <FaRegMap />,
  memberships: <BsShield />,
  coins: <GiCoins />,
  digitalService: <GiDiploma />,
  algorithmMrRange: <SiThealgorithms />,
  participationsIcon: <MdApartment />,
  participationsAdmin: <IoBusiness />,
  adminCredits: <LiaCoinsSolid />,
  distributorMarketplace: <FaShopLock />,
  bull: <GiBull />,
}

export default navigationIcon
