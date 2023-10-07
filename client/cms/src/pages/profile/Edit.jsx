import { Container, Row, Col, Form } from "react-bootstrap"
import { FormInput, SubmitBtn } from "../../components"
import { setInForm } from "../../lib"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import http from "../../http"
import { setUser } from "../../store"

export const Edit = () => {
    const [form, setForm] = useState({})
    const [loading, setLoading] = useState(false)

    const user = useSelector(state => state.user.value)

    const dispatch = useDispatch()

    useEffect(() => {
        if(Object.keys(user).length) {
            console.log(user)
            setForm({
                name: user.name,
                phone: user.phone,
                address: user.address,
            })
        }
    }, [user])

    const handleSubmit = ev => {
        ev.preventDefault()
        setLoading(true)

        http.patch('profile/edit-profile', form)
            .then(() => http.get('profile/details'))
            .then(({data}) => dispatch(setUser(data)))
            .catch(err => {})
            .finally(() => setLoading(false))
    }

    return <Container>
    <Row>
        <Col xs={12} className="bg-white my-3 py-3 rounded-2 shadow-sm">
            <Row>
                <Col lg={6} className="mx-auto">
                    <h1>EDIT PROFILE</h1>
                </Col>
            </Row>
            <Row>
                <Col lg={6} className="mx-auto">
                <Form onSubmit={handleSubmit}>
                        <FormInput title="name" label="NAME">
                            <Form.Control type="text" name="name" id="name" onChange={ev => setInForm(ev, form, setForm)} defaultValue={form.name} autoComplete="off" required />
                        </FormInput>
                        <FormInput title="email" label="EMAIL">
                            <Form.Control type="text" defaultValue={user.email} plaintext readOnly />
                        </FormInput>
                        <FormInput title="phone" label="PHONE">
                            <Form.Control type="text" name="phone" id="phone" onChange={ev => setInForm(ev, form, setForm)} defaultValue={form.phone} required />
                        </FormInput>
                        <FormInput title="address" label="ADDRESS">
                            <Form.Control as="textarea" name="address" id="address" onChange={ev => setInForm(ev, form, setForm)} defaultValue={form.address} required />
                        </FormInput>
                        <div className="mb-3">
                            <SubmitBtn loading={loading} />
                        </div>
                    </Form>
                </Col>
            </Row>
        </Col>
    </Row>
</Container>
}