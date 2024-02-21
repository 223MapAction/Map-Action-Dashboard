import React, { Component } from 'react'
import MetaTags from 'react-meta-tags';
import DocumentMeta from 'react-document-meta';
import axios from 'axios'

export default class ShareIncident extends Component {

  constructor(props) {


    super(props);
    this.state = {
      id: this.props.match.params.id,
      data: [],
      url_photo: ''
    }
  }

  componentDidMount() {
    console.log(this.props);
    console.log(this.props.match.params.id);
    this._getIncidentbyId();
    // window.location.replace(
    //   "https://play.google.com/store/apps/details?id=com.volkeno.actionmap"
    // );
  }

  _getIncidentbyId = async () => {
    var url = global.config.url + 'api/incident/' + this.state.id;
    try {

      let res = await axios.get(url, {
        headers: {
          Authorization: `Bearer${sessionStorage.token}`,

          'Content-Type': 'application/json',
        }
      });
      console.log(res.data)
      let data = res.data;
      // let photo= 'http://137.74.196.127:8000' +data.photo
      let photo = global.config.url.slice(0, -1) + data.photo;
      console.log(photo)
      this.setState({ data: data, url_photo: photo });
    } catch (error) {
      console.log(error.message);
    }
  }
  render() {
    const meta = {
      title: this.state.data.title,
      description: this.state.data.description,
      canonical: 'http://example.com/path/to/page',
      meta: {
        charset: 'utf-8',
        name: {
          keywords: this.state.data.title,
        },
        property: {
          'og:title': this.state.data.title,
          'og:url': '`https://play.google.com/store/apps/details?id=com.volkeno.actionma`',
          'og:image': this.state.url_photo,
          'og:description': this.state.data.description,

          'twitter:card': 'summary_large_image',
          'twitter:title': this.state.data.title,
          'twitter:description': this.state.data.description,
          'twitter:image': this.state.url_photo,
          'twitter:url': '`https://play.google.com/store/apps/details?id=com.volkeno.actionmap`'
        }

      }
    };
    return (
      <DocumentMeta {...meta}>
        {/* <h1>Redirecting...</h1>
          <p>You should be redirected automatically to:</p>
          <p>
            <a
              href="https://play.google.com/store/apps/details?id=com.volkeno.actionmap"
              >https://play.google.com/store/apps/details?id=com.volkeno.actionmap</a
            >
          </p>
          <p>If not click the link.</p> */}
      </DocumentMeta>
    )
  }

}