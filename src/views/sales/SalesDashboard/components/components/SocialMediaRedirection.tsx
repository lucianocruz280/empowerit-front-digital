import { BsWhatsapp } from 'react-icons/bs'

const WHATSAPP_COMMUNITY = 'https://chat.whatsapp.com/HwD2Xf2h6GTAtj0ov68uhK'

const SocialMediaRedirection = () => {
  return (
    <>
      <div className="flex flex-col items-center bg-slate-100 p-4 rounded-[10px] h-fit w-full xl:w-[100%]">
        <h5>¡Únete a nuestra comunidad en WhatsApp!</h5>
        <a
          className="flex flex-row justify-center h-fit w-full xl:w-[50%] space-x-2"
          href={WHATSAPP_COMMUNITY}
          target="_blank"
          rel="noreferrer"
        >
          <BsWhatsapp className="text-xl" />
          <strong>EMPOWERIT TOP Server</strong>
        </a>
      </div>
    </>
  )
}

export default SocialMediaRedirection
