import SignUpForm from './SignUpForm'

const SignUp = () => {
    return (
        <>
            <div className="mb-8">
                <h3 className="mb-1">Regístrate</h3>
                <p>Y empieza a aprender con nosotros</p>
            </div>
            <SignUpForm disableSubmit={false} />
        </>
    )
}

export default SignUp
