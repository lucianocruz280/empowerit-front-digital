import SignUpForm from './SignUpForm'

const SignUp = () => {
  return (
    <>
      <div className="mb-8">
        <h3 className="mb-1">Registrar usuario</h3>
        <p>Registrar y activar academia inmediatamente</p>
      </div>
      <SignUpForm disableSubmit={false} />
    </>
  )
}

export default SignUp
