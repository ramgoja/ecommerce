import { useEffect, useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { Link } from "react-router-dom"
import http from "../../http"
import { DataTable, Loading } from "../../components"
import { confirmAlert } from "react-confirm-alert"
import moment from "moment"

export const List = () => {
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)

        http.get('cms/customers')
            .then(({data}) => setCustomers(data) )
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

                        http.delete(`cms/customers/${id}`)
                            .then(() => http.get('cms/customers'))
                            .then(({data}) => setCustomers(data))
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
                    <h1>CUSTOMERS</h1>
                </Col>
                <Col xs="auto">
                    <Link to="/customers/create" className="btn btn-dark" >
                        <i className="fa-solid fa-plus me-2 "></i>ADD CUSTOMER
                    </Link>
                </Col>
            </Row>
            {loading ? <Loading /> : <Row>
                <Col>
                    <DataTable searchable={['Name', 'Email', 'Address', 'Phone', 'Status', 'Created At', 'Updated At']} sortable={['Name', 'Email', 'Address', 'Phone', 'Status', 'Created At', 'Updated At']} data={customers.map(customer => {
                        return{
                            'Name': customer.name,
                            'Email': customer.email,
                            'Phone': customer.phone,
                            'Address': customer.address,
                            'Status': customer.status ? 'Active' : 'Inactive',
                            'Created At': moment(customer.createdAt).format('lll'),
                            'Updated At': moment(customer.updatedAt).format('lll'),
                            'Actions': <>
                                <Link to={`/customers/${customer._id}/edit`} className="btn btn-dark btn-sm me-2">
                                    <i className="fa-solid fa-edit me-2"></i>EDIT
                                </Link>
                                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(customer._id)}>
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