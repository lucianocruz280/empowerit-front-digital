import useWindowSize from '@/components/ui/hooks/useWindowSize'
import classNames from 'classnames'
import { useRef, useState, FC, ReactNode } from 'react'
import { FaCheck, FaChevronUp, FaTimes } from 'react-icons/fa'
import Stories from 'react-insta-stories'
import { Story } from 'react-insta-stories/dist/interfaces'

const ListItem: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div className="flex space-x-3 items-center">
      <FaCheck className="text-green-500" />
      <span className={className}>{children}</span>
    </div>
  )
}

const ShowMore = ({ toggleMore }: any) => {
  return (
    <div
      className="flex flex-col space-y-2 justify-center items-center mb-[20px] text-gray-400 hover:text-white"
      onClick={() => toggleMore(true)}
    >
      <FaChevronUp />
      <span>Ver más</span>
    </div>
  )
}

const stories: Story[] = [
  {
    url: '/img/shop/acapulco-feb-2024.jpg',
    seeMoreCollapsed: ShowMore,
    seeMore: ({ close }: any) => {
      return (
        <div className="h-full w-full text-center p-8 bg-gray-800/90 text-white flex flex-col">
          <div className="absolute right-5 top-5">
            <FaTimes onClick={close} />
          </div>

          <h2 className="text-lg text-white underline">Acapulco</h2>
          <p className="font-bold text-2xl">Park Royal Beach</p>
          <p>4 Dias 3 Noches</p>
          <div className="flex flex-col my-8 flex-1">
            <ListItem>2 Camas Dobles</ListItem>
            <ListItem>Wifi Gratis</ListItem>
            <ListItem>Aire Acondicionado</ListItem>
            <ListItem>Vista a la Naturaleza</ListItem>
            <ListItem>Gimnasio</ListItem>
            <ListItem>Servicio de Spa</ListItem>
            <ListItem>Servicios Ejecutivos</ListItem>
            <ListItem>Servicio de Limpieza</ListItem>
            <ListItem>Área Infantil</ListItem>
            <ListItem>Acceso a 3 restaurantes</ListItem>
            <ListItem>Bar junto a la Alberca</ListItem>
            <ListItem>Y mucho más</ListItem>
          </div>
          <p className="text-right">
            <span className="font-bold text-lg text-yellow-400">
              Desde: $4,295
            </span>
            <br />
            <span className="text-xs">por persona</span>
          </p>
          <a href="tel:+528129015607">
            <div className="rounded-md bg-color-1 font-bold w-full h-[40px] flex items-center justify-center mt-[20px]">
              RESERVAR AHORA
            </div>
          </a>
        </div>
      )
    },
  },
  {
    url: '/img/shop/huatulco-feb-2024.jpg',
    seeMoreCollapsed: ShowMore,
    seeMore: ({ close }: any) => {
      return (
        <div className="h-full w-full text-center p-8 bg-gray-800/90 text-white flex flex-col">
          <div className="absolute right-5 top-5">
            <FaTimes onClick={close} />
          </div>

          <h2 className="text-lg text-white underline">Huatulco</h2>
          <p className="font-bold text-2xl">Barceló Huatulco</p>
          <p>4 Dias 3 Noches</p>
          <div className="flex flex-col my-8 flex-1">
            <ListItem>All-Inclusive</ListItem>
            <ListItem>Cuarto con vista al jardín</ListItem>
            <ListItem>2 Camas Dobles</ListItem>
            <ListItem>Aire Acondicionado</ListItem>
            <ListItem>Gimnasio</ListItem>
            <ListItem>Cancha de Tenis</ListItem>
            <ListItem>Servicio de Spa</ListItem>
            <ListItem>¡Y mucho más!</ListItem>
          </div>
          <p className="text-right">
            <span className="font-bold text-lg text-yellow-400">
              Desde: $4,977
            </span>
            <br />
            <span className="text-xs">por persona</span>
          </p>
          <a href="tel:+528129015607">
            <div className="rounded-md bg-color-1 font-bold w-full h-[40px] flex items-center justify-center mt-[20px]">
              RESERVAR AHORA
            </div>
          </a>
        </div>
      )
    },
  },
  {
    url: '/img/shop/mazatlan-ene-2024.jpg',
    seeMoreCollapsed: ShowMore,
    seeMore: ({ close }: any) => {
      return (
        <div className="h-full w-full text-center p-8 bg-gray-800/90 text-white flex flex-col">
          <div className="absolute right-5 top-5">
            <FaTimes onClick={close} />
          </div>

          <h2 className="text-lg text-white underline">Mazatlán</h2>
          <p className="font-bold text-2xl">Riu Esmeralda Bay</p>
          <p>4 Dias 3 Noches</p>
          <div className="flex flex-col my-8 flex-1">
            <ListItem>All-Inclusive</ListItem>
            <ListItem>Habitación con Vista al Mar (37m²)</ListItem>
            <ListItem>Servicio a la Habitación</ListItem>
            <ListItem>Wifi Gratuito</ListItem>
            <ListItem>1 Cama King y 1 Cama Matrimonial</ListItem>
            <ListItem>Acceso a Restaurantes y Bares</ListItem>
            <ListItem>Acceso a 5 Albercas</ListItem>
            <ListItem>Estacionamiento Gratuito</ListItem>
            <ListItem>Clases de Aeróbics</ListItem>
            <ListItem>Voleiból de Playa</ListItem>
            <ListItem>Mesa de Billar</ListItem>
            <ListItem>Servicio de Spa</ListItem>
            <ListItem>Club Nocturno</ListItem>
            <ListItem>Acceso a Tiendas</ListItem>
            <ListItem>Acceso a Shows</ListItem>
            <ListItem>Acceso a Parque Acuático</ListItem>
            <ListItem>¡Y mucho más!</ListItem>
          </div>
          <p className="text-right">
            <span className="font-bold text-lg text-yellow-400">
              Desde: $7,425
            </span>
            <br />
            <span className="text-xs">por persona</span>
          </p>
          <a href="tel:+528129015607">
            <div className="rounded-md bg-color-1 font-bold w-full h-[40px] flex items-center justify-center mt-[20px]">
              RESERVAR AHORA
            </div>
          </a>
        </div>
      )
    },
  },
  {
    url: '/img/shop/PuertoVallarta-feb-2024.jpg',
    seeMoreCollapsed: ShowMore,
    seeMore: ({ close }: any) => {
      return (
        <div className="h-full w-full text-center p-8 bg-gray-800/90 text-white flex flex-col">
          <div className="absolute right-5 top-5">
            <FaTimes onClick={close} />
          </div>

          <h2 className="text-lg text-white underline">Puerto Vallarta</h2>
          <p className="font-bold text-2xl">Grand Park Royal</p>
          <p>4 Dias 3 Noches</p>
          <div className="flex flex-col my-8 flex-1">
            <ListItem>2 Camas Dobles</ListItem>
            <ListItem>Wifi Gratuito</ListItem>
            <ListItem>Vista al Mar</ListItem>
            <ListItem>Gimnasio</ListItem>
            <ListItem>Área de Niños</ListItem>
            <ListItem>4 Restaurantes</ListItem>
            <ListItem>5 Bares</ListItem>
            <ListItem>2 Albercas</ListItem>
            <ListItem>Servicio de Spa</ListItem>
            <br />
            <ListItem className="underline text-left text-xs">
              Además 10% de desc. en Spa y 1 Botella de Bebida Alcohólica Gratis
            </ListItem>
          </div>
          <p className="text-right">
            <span className="font-bold text-lg text-yellow-400">
              Desde: $5,999
            </span>
            <br />
            <span className="text-xs">por persona</span>
          </p>
          <a href="tel:+528129015607">
            <div className="rounded-md bg-color-1 font-bold w-full h-[40px] flex items-center justify-center mt-[20px]">
              RESERVAR AHORA
            </div>
          </a>
        </div>
      )
    },
  },
  {
    url: '/img/shop/Playeras-1.png',
    seeMoreCollapsed: ShowMore,
  },
  {
    url: '/img/shop/Playeras-2.png',
    seeMoreCollapsed: ShowMore,
  },
]

const TopShop = () => {
  const storiesRef = useRef(null)
  const [storyIndex, setStoryIndex] = useState(0)

  const { width, height } = useWindowSize()

  return (
    <div className="flex flex-col items-center">
      <Stories
        ref={storiesRef}
        stories={stories}
        defaultInterval={3000}
        width={width && width > 1030 ? 432 : width}
        height={height && height < 768 ? height - 80 : 768}
        loop={true}
        onStoryStart={(index: number) => {
          setStoryIndex(index)
        }}
      />
      <div className="space-x-3 mt-5 hidden md:flex">
        {stories.map((story, index) => (
          <img
            key={index}
            className={classNames(
              'w-[80px] object-cover transition-all duration-100',
              {
                'brightness-[.25]': index != storyIndex,
                'brightness-100': index == storyIndex,
              }
            )}
            src={story.url}
          />
        ))}
      </div>
    </div>
  )
}

export default TopShop
