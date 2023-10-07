import { useEffect, useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { Link } from "react-router-dom"
import http from "../../http"
import { DataTable, Loading } from "../../components"
import { confirmAlert } from "react-confirm-alert"
import moment from "moment"

export const List = () => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)

        http.get('cms/categories')
            .then(({data}) => setCategories(data) )
            .catch(err => {})
            .finally(() => setLoading(false))
    }, [])

    const handleDelete = id => {
        confirmAlert({
            title: 'Confirm',
            message: 'Are you sure you want to delete this item?',
            buttons: [
                {
                    label: 'Sure',
                    onClick: () => {
                        setLoading(true)

                        http.delete(`cms/categories/${id}`)
                            .then(() => http.get('cms/categories'))
                            .then(({data}) => setCategories(data))
                            .catch(err => {})
                            .finally(() => setLoading(false))
                    }
                },
                {
                    label: 'Abort',
                    onClick: () => {}
                }
            ]
        })
    }

    return <Container>
    <Row>
        <Col xs={12} className="bg-white my-3 py-3 rounded-2 shadow-sm">
            <Row>
                <Col>
                    <h1>CATEGORIES</h1>
                </Col>
                <Col xs="auto">
                    <Link to="/categories/create" className="btn btn-dark" >
                        <i className="fa-solid fa-plus me-2 "></i>ADD CATEGORIES
                    </Link>
                </Col>
            </Row>
            {loading ? <Loading /> : <Row>
                <Col>
                    <DataTable searchable={['Name', 'Status', 'Created At', 'Updated At']} sortable={['Name', 'Status', 'Created At', 'Updated At']} data={categories.map(category => {
                        return{
                            'Name': category.name,
                            'Status': category.status ? 'Active' : 'Inactive',
                            'Created At': moment(category.createdAt).format('lll'),
                            'Updated At': moment(category.updatedAt).format('lll'),
                            'Actions': <>
                                <Link to={`/categories/${category._id}/edit`} className="btn btn-dark btn-sm me-2">
                                    <i className="fa-solid fa-edit me-2"></i>EDIT
                                </Link>
                                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(category._id)}>
                                    <i className="fa-solid fa-trash me-2"></i>DELETE
                                </Button>
                            </>
                        }
                    })} />
                </Col>
                </Row>}
        </Col>
    </Row>
</Container>
}