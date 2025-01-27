import SignInForm from './SignInForm'

const SignIn = () => {
  return (
    <>
      <div className="mb-8">
        <div className="flex justify-center mb-8 md:hidden">
          <img src="/img/welcome.png" className="w-full h-full object-cover hidden md:block" />
          <img src="/img/welcome-mobile.png" className="w-full h-full object-cover md:hidden" />
        </div>
        <h3 className="mb-1">¡Bienvenido!</h3>
        <p>Por favor, escribe tu correo y contraseña para iniciar sesión</p>
      </div>
      <SignInForm disableSubmit={false} />
    </>
  )
}

export default SignIn
