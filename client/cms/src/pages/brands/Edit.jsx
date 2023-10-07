import { Container, Row, Col, Form } from "react-bootstrap"
import { FormInput, Loading, SubmitBtn } from "../../components"
import { setInForm } from "../../lib"
import { useEffect, useState } from "react"
import http from "../../http"
import { useNavigate, useParams } from "react-router-dom"
import Switch from "react-switch"

export const Edit = () => {
    const [form, setForm] = useState({})
    const [brand, setBrand] = useState({})
    const [loading, setLoading] = useState(false)
    const [loadingPage, setLoadingPage] = useState(true)

    const params = useParams()

    const navigate = useNavigate()


    useEffect(() => {
        setLoadingPage(true)

        http.get(`cms/brands/${params.id}`)
            .then(({data}) => setBrand(data))
            .catch(err => {})
            .finally(() => setLoadingPage(false))
    }, [])

    useEffect(() => {
        if(Object.keys(brand).length) {
            setForm({
                name: brand.name,
                status: brand.status,
            })
        }
    }, [brand])

    const handleSubmit = ev => {
        ev.preventDefault()
        setLoading(true)

        http.patch(`cms/brands/${params.id}`, form)
            .then(() => navigate('/brands'))
            .catch(err => {})
            .finally(() => setLoading(false))
    }

    return <Container>
    <Row>
        <Col xs={12} className="bg-white my-3 py-3 rounded-2 shadow-sm">
            <Row>
                <Col lg={6} className="mx-auto">
                    <h1>EDIT BRAND</h1>
                </Col>
            </Row>
            <Row>
                <Col lg={6} className="mx-auto">
                    {loadingPage ? <Loading/> : <Form onSubmit={handleSubmit}>
                        <FormInput title="name" label="NAME">
                            <Form.Control type="text" name="name" id="name" onChange={ev => setInForm(ev, form, setForm)} defaultValue={form.name} autoComplete="off" required />
                        </FormInput>
                        <FormInput title="status" label="STATUS">
                            <br/>
                             <Switch id="status" checked={form.status} onChange={() => {
                                setForm({
                                    ...form,
                                    status: !form.status,
                                })
                             }} />
                        </FormInput>
                        <div className="mb-3">
                            <SubmitBtn loading={loading} />
                        </div>
                    </Form>}
                </Col>
            </Row>
        </Col>
    </Row>
</Container>
}