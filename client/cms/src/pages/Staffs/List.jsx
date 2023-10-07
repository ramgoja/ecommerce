import { useEffect, useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { Link } from "react-router-dom"
import http from "../../http"
import { DataTable, Loading } from "../../components"
import { confirmAlert } from "react-confirm-alert"
import moment from "moment"

export const List = () => {
    const [staffs, setStaffs] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)

        http.get('cms/staffs')
            .then(({data}) => setStaffs(data) )
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

                        http.delete(`cms/staffs/${id}`)
                            .then(() => http.get('cms/staffs'))
                            .then(({data}) => setStaffs(data))
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
                    <h1>STAFFS</h1>
                </Col>
                <Col xs="auto">
                    <Link to="/staffs/create" className="btn btn-dark" >
                        <i className="fa-solid fa-plus me-2 "></i>ADD STAFF
                    </Link>
                </Col>
            </Row>
            {loading ? <Loading /> : <Row>
                <Col>
                    <DataTable searchable={['Name', 'Email', 'Address', 'Phone', 'Status', 'Created At', 'Updated At']} sortable={['Name', 'Email', 'Address', 'Phone', 'Status', 'Created At', 'Updated At']} data={staffs.map(staff => {
                        return{
                            'Name': staff.name,
                            'Email': staff.email,
                            'Phone': staff.phone,
                            'Address': staff.address,
                            'Status': staff.status ? 'Active' : 'Inactive',
                            'Created At': moment(staff.createdAt).format('lll'),
                            'Updated At': moment(staff.updatedAt).format('lll'),
                            'Actions': <>
                                <Link to={`/staffs/${staff._id}/edit`} className="btn btn-dark btn-sm me-2">
                                    <i className="fa-solid fa-edit me-2"></i>EDIT
                                </Link>
                                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(staff._id)}>
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