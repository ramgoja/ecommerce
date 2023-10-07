import { Container, Row, Col, Form, Button } from "react-bootstrap"
import { FormInput, Loading, SubmitBtn } from "../../components"
import { imgUrl, setInForm } from "../../lib"
import { useEffect, useState } from "react"
import http from "../../http"
import { useNavigate, useParams } from "react-router-dom"
import Switch from "react-switch"
import 'react-quill/dist/quill.snow.css'
import ReactQuill from 'react-quill'
import { confirmAlert } from "react-confirm-alert"


export const Edit = () => {
    const [form, setForm] = useState({status: true, featured: false})
    const [loading, setLoading] = useState(false)
    const [loadingPage, setLoadingPage] = useState(false)
    const [categories, setCategories] = useState([])
    const [brands, setBrands] = useState([])
    const [imgSeleted, setImgSeleted] = useState([])
    const [product, setProduct] = useState({})

    const navigate = useNavigate()

    const params = useParams()

    useEffect(() => {
        setLoadingPage(true)
        http.get('cms/categories')
            .then(({data}) => {
                setCategories(data)

                return http.get('cms/brands')
            })
            .then(({data}) => {
                setBrands(data)

                return http.get(`cms/products/${params.id}`)
            })
            .then(({data}) => setProduct(data))
            .catch(err => {})
            .finally(() => setLoadingPage(false))
    }, [])

    useEffect(() => {
        if(Object.keys(product).length) {
            setForm({
                name: product.name,
                summary: product.summary,
                description: product.description,
                price: product.price,
                discounted_price: product.discounted_price,
                category_id: product.category_id,
                brand_id: product.brand_id,
                status: product.status,
                featured: product.featured,
                images: []
            })
        }
    }, [product])

    useEffect(() => {
       if('images' in form && form.images.length) {
            let temp = []

            for(let image of form.images){
                temp.push(<img src={URL.createObjectURL(image)} className="img-fluid mt-3" />)
            }

            setImgSeleted(temp)
       } 
    } , [form])

    const handleSubmit = ev => {
        ev.preventDefault()
        setLoading(true)

        const fd = new FormData

        for(let key in form) {
            if(key == 'images') {
                for(let image of form.images) {
                    fd.append('images', image)
                }
            } else {
                fd.append(key, form[key])
            }
        }

        http.patch(`cms/products/${params.id}`, fd, {
                headers: {
                    'Content-Type' : 'multipart/form-data'
                }
            })
            .then(() => navigate('/products'))
            .catch(err => {})
            .finally(() => setLoading(false))
    }


    const modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image'],
          ['clean']
        ],
      }
    
    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
      ]
    
    const handleImgDelete = filename => {
        confirmAlert({
            title: 'Confirm',
            message: 'Are you sure you want to delete this item?',
            buttons: [
                {
                    label: 'Sure',
                    onClick: () => {
                        setLoadingPage(true)

                        http.delete(`cms/products/${params.id}/image/${filename}`)
                            .then(() => http.get(`cms/products/${params.id}`))
                            .then(({data}) => setProduct(data))
                            .catch(err => {})
                            .finally(() => setLoadingPage(false))
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
                <Col lg={6} className="mx-auto">
                    <h1>EDIT PRODUCTS</h1>
                </Col>
            </Row>
            <Row>
                <Col lg={6} className="mx-auto">
                {loadingPage ? <Loading /> : 
                <Form onSubmit={handleSubmit}>
                <FormInput title="name" label="NAME">
                    <Form.Control type="text" name="name" id="name" onChange={ev => setInForm(ev, form, setForm)} defaultValue={form.name} autoComplete="off" required />
                </FormInput>
                <FormInput title="summary" label="SUMMARY">
                    <ReactQuill theme="snow" modules={modules} formats={formats} value={form.summary} onChange={data => setForm({
                        ...form,
                        summary: data,
                    })} />
                </FormInput>
                <FormInput title="description" label="DESCRIPTION">
                <ReactQuill theme="snow" modules={modules} formats={formats} value={form.description} onChange={data => setForm({
                        ...form,
                        description: data,
                    })} />
                </FormInput>
                <FormInput title="price" label="PRICE">
                    <Form.Control type="text" name="price" id="price" onChange={ev => setInForm(ev, form, setForm)} defaultValue={form.price} required />
                </FormInput>
                <FormInput title="discounted_price" label="DISCOUNTED PRICE">
                    <Form.Control type="text" name="discounted_price" id="discounted_price" onChange={ev => setInForm(ev, form, setForm)} defaultValue={form.discounted_price} />
                </FormInput>
                <FormInput title="images" label="IMAGES">
                    <Form.Control type="file" name="images" id="images" onChange={ev => setForm({
                        ...form,
                        images: ev.target.files
                    })} accept="image/*"  multiple />
                    {imgSeleted.length ? <Row>
                        {imgSeleted.map((preview, i) => <Col lg={4} key={i}>{preview}</Col>)}
                    </Row> : null}
                    <Row>
                        {product.images ? product.images.map((image, i) => <Col lg={4} key={i} className="mt-3">
                            <Row>
                                <Col xs={12}>
                                    <img src={imgUrl(image)} className="img-fluid" />
                                </Col>
                                <Col xs={12} className="mt-3 text-center">
                                    <Button variant="danger" size="sm" onClick={() => handleImgDelete(image)} >
                                        <i className="fa-solid fa-trash me-2" ></i>DELETE
                                    </Button>
                                </Col>
                            </Row>
                        </Col>) : null}
                    </Row>
                </FormInput>
                <FormInput title="category_id" label="CATEGORY">
                    <Form.Select name="category_id" id="category_id" onChange={ev => setInForm(ev, form, setForm)} value={form.category_id} required >
                        <option value="">SELECT A CATEGORY</option>
                        {categories.map(category => <option key={category._id} value={category._id}>{category.name}</option>)}
                    </Form.Select>
                </FormInput>
                <FormInput title="brand_id" label="BRAND">
                    <Form.Select name="brand_id" id="brand_id" onChange={ev => setInForm(ev, form, setForm)} value={form.brand_id} required >
                        <option value="">SELECT A BRAND</option>
                        {brands.map(brand => <option key={brand._id} value={brand._id}>{brand.name}</option>)}
                    </Form.Select>
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
                <FormInput title="featured" label="FEATURED">
                    <br/>
                     <Switch id="featured" checked={form.featured} onChange={() => {
                        setForm({
                            ...form,
                            featured: !form.featured,
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