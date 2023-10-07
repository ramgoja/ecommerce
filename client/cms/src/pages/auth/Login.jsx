import { useState } from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap"
import { inStorage, setInForm } from "../../lib"
import { FormInput } from "../../components/FormInput"
import http from "../../http"
import { SubmitBtn } from "../../components/SubmitBtn"
import { useDispatch } from "react-redux";
import {setUser} from "../../store";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const [form, setForm] = useState({})
    const [remember, setRemember] = useState(false)
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const handleSubmit = ev => {
        ev.preventDefault()
        setLoading(true)

        http.post('auth/login', form)
            .then(({data}) => {
                dispatch(setUser(data.user))
                inStorage('user_token', data.token, remember)
                navigate('/')
            })
            .catch(err => {})

            .finally(() => setLoading(false))
    }
    
    return <Container>
    <Row>
        <Col lg={4} md={5} sm={6} className="bg-white my-5 mx-auto py-3 rounded-2 shadow-sm">
            <Row>
                <Col>
                    <h1 className="text-center">Login</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form onSubmit={handleSubmit}>
                        <FormInput title="email" label="EMAIL">
                            <Form.Control type="email" name="email" id="email" placeholder="abc@gmail.com" onChange={ev => setInForm(ev, form, setForm)} required />
                        </FormInput>
                        <FormInput title="password" label="PASSWORD">
                            <Form.Control type="password" name="password" id="password" onChange={ev => setInForm(ev, form, setForm)} required />
                        </FormInput>
                        <div className="mb-3 form-check">
                            <Form.Check.Input name="remember" id="remember" defaultChecked={remember} onClick={ev => setRemember(!remember)} />
                            <Form.Check.Label htmlFor="remember" >Remember Me</Form.Check.Label>
                        </div>
                        <div className="mb-3 d-grid">
                            <SubmitBtn label="Log In" icon="fa-sign-in-alt" loading={loading} />
                        </div>
                    </Form>
                </Col>
            </Row>
        </Col>
    </Row>
</Container>
}