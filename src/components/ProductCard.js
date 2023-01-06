import Axios from "axios"
import React, { useState } from "react"

function ProductCard(props) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftName, setDraftName] = useState("")
  const [file, setFile] = useState()
  const [draftModel, setDraftModel] = useState("")

  async function submitHandler(e) {
    e.preventDefault()
    setIsEditing(false)
    props.setProducts(prev =>
      prev.map(function (product) {
        if (product._id == props.id) {
          return { ...product, name: draftName, model: draftModel }
        }
        return product
      })
    )
    const data = new FormData()
    if (file) {
      data.append("photo", file)
    }
    data.append("_id", props.id)
    data.append("name", draftName)
    data.append("model", draftModel)
    const newPhoto = await Axios.post("/update-product", data, { headers: { "Content-Type": "multipart/form-data" } })
    if (newPhoto.data) {
      props.setProducts(prev => {
        return prev.map(function (product) {
          if (product._id == props.id) {
            return { ...product, photo: newPhoto.data }
          }
          return product
        })
      })
    }
  }

  return (
    <div className="card">
      <div className="our-card-top">
        {isEditing && (
          <div className="our-custom-input">
            <div className="our-custom-input-interior">
              <input onChange={e => setFile(e.target.files[0])} className="form-control form-control-sm" type="file" />
            </div>
          </div>
        )}
        <img src={props.photo ? `/uploaded-photos/${props.photo}` : "img/fallback.png"} className="card-img-top" alt={`${props.model} named ${props.name}`} />
      </div>
      <div className="card-body">
        {!isEditing && (
          <>
            <h4>{props.name}</h4>
            <p className="text-muted small">{props.model}</p>
            {!props.readOnly && (
              <>
                <button
                  onClick={() => {
                    setIsEditing(true)
                    setDraftName(props.name)
                    setDraftModel(props.model)
                    setFile("")
                  }}
                  className="btn btn-sm btn-primary"
                >
                  Edit
                </button>{" "}
                <button
                  onClick={async () => {
                    const test = Axios.delete(`/animal/${props.id}`)
                    props.setProducts(prev => {
                      return prev.filter(product => {
                        return product._id != props.id
                      })
                    })
                  }}
                  className="btn btn-sm btn-outline-danger"
                >
                  Delete
                </button>
              </>
            )}
          </>
        )}
        {isEditing && (
          <form onSubmit={submitHandler}>
            <div className="mb-1">
              <input autoFocus onChange={e => setDraftName(e.target.value)} type="text" className="form-control form-control-sm" value={draftName} />
            </div>
            <div className="mb-2">
              <input onChange={e => setDraftModel(e.target.value)} type="text" className="form-control form-control-sm" value={draftModel} />
            </div>
            <button className="btn btn-sm btn-success">Save</button>{" "}
            <button onClick={() => setIsEditing(false)} className="btn btn-sm btn-outline-secondary">
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ProductCard