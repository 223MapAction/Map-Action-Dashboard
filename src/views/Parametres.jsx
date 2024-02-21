import Card from "components/Card/Card";
import React, { Component } from "react";
import { Col, Form, FormGroup, Grid, Row } from "react-bootstrap";
import Background from "assets/img/map-bg-1.jpg";
import axios from "axios";
export default class Parametres extends Component {
  state = {
    file: null,
    photo: undefined,
    previewImage: undefined,
    progress: 0,
    load: false,
  };

  componentDidMount() {
    this.getImages();
  }

  getImages = async () => {
    var url = global.config.url + "api/imagebackground/";
    let { file } = this.state;
    try {
      let res = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("response=>", res["data"]);
      let data = res["data"];
      if (Object.keys(data).length !== 0) {
        file = data.photo;
        this.setState({ file });
      }
    } catch (error) {
      console.log("erreur=>", error.response);
    }
  };

  onFileChange = async (e) => {
    e.preventDefault();
    let { file, photo, previewImage } = this.state;
    photo = e.target.files[0];
    previewImage = URL.createObjectURL(e.target.files[0]);
    file = e.target.files[0];
    // test = URL.createObjectURL(e.target.files[0]);
    // console.log("file", e.target.files[0].name);
    this.setState({ photo, previewImage, progress: 0 });
  };

  upload = async () => {
    let { photo } = this.state;
    var url = global.config.url + "api/imagebackground/";
    this.setState({
      progress: 0,
      load: true,
    });

    try {
      if (photo) {
        let formData = new FormData();
        formData.append("photo", photo);
        let request = await axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer ".concat(sessionStorage.token),
          },
        });
        // console.log("response=>", request);
        this.setState({
          file: request["data"].photo,
          load: false,
          previewImage: undefined,
        });
      }
    } catch (error) {
      console.log("erreur=>", error.response);
      this.setState({ load: false });
    }
  };

  render() {
    let { file, load, previewImage, photo } = this.state;
    let image = `https://backend-dashboard.map-action.com/${file}`;
    // let image = photo;
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col>
              <Card
                title={"Parametres"}
                content={
                  <React.Fragment>
                    <div className="manage-login-page-bgimg-container">
                      <h4 className="update-login-bgimg-input-label">Changer l'image de fond de la page de connexion</h4>
                      <div className="divider"></div>
                      <Row className="upload-login-bgimg-row">
                        <Col md={8} className="upload-bgimg-file-input">
                          <label htmlFor="" className="btn btn-default p-0">
                            <input
                              type="file"
                              onChange={this.onFileChange}
                              name="photo"
                              label="Photo"
                            />
                          </label>
                        </Col>
                        <Col md={4}>
                          {!load ? (
                            <button
                              className="btn btn-success btn-sm upload-new-bgimg-submit-btn"
                              disabled={!photo}
                              onClick={this.upload}
                            >
                              Modifier
                            </button>
                          ) : (
                            <button className="btn btn-success btn-sm upload-new-bgimg-submit-btn">
                              <i
                                className="fa fa-spin fa-spinner"
                                aria-hidden="true"
                              ></i>&nbsp;
                              En cours...
                            </button>
                          )}
                        </Col>
                      </Row>
                    </div>
                    {previewImage && (
                      <div className="uploaded-img-preview-container">
                        <img
                          style={{ maxWidth: "200px" }}
                          src={previewImage}
                          alt=""
                          className="preview-image-item"
                        />
                      </div>
                    )}
                    <div className="divider"></div>
                    <FormGroup>
                      <img
                        //   style={{ maxWidth: " 1000px" }}
                        src={file ? image : Background}
                        width="200"
                        height="230"
                        alt="description"
                      />
                    </FormGroup>
                  </React.Fragment>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
