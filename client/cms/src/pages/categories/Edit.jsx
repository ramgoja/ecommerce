import { Container, Row, Col, Form } from "react-bootstrap"
import { FormInput, Loading, SubmitBtn } from "../../components"
import { setInForm } from "../../lib"
import { useEffect, useState } from "react"
import http from "../../http"
import { useNavigate, useParams } from "react-router-dom"
import Switch from "react-switch"

export const Edit = () => {
    const [form, setForm] = useState({})
    const [category, setCategory] = useState({})
    const [loading, setLoading] = useState(false)
    const [loadingPage, setLoadingPage] = useState(true)

    const params = useParams()

    const navigate = useNavigate()


    useEffect(() => {
        setLoadingPage(true)

        http.get(`cms/categories/${params.id}`)
            .then(({data}) => setCategory(data))
            .catch(err => {})
            .finally(() => setLoadingPage(false))
    }, [])

    useEffect(() => {
        if(Object.keys(category).length) {
            setForm({
                name: category.name,
                status: category.status,
            })
        }
    }, [category])

    const handleSubmit = ev => {
        ev.preventDefault()
        setLoading(true)

        http.patch(`cms/categories/${params.id}`, form)
            .then(() => navigate('/categories'))
            .catch(err => {})
            .finally(() => setLoading(false))
    }

    return <Container>
    <Row>
        <Col xs={12} className="bg-white my-3 py-3 rounded-2 shadow-sm">
            <Row>
                <Col lg={6} className="mx-auto">
                    <h1>EDIT CATEGORY</h1>
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