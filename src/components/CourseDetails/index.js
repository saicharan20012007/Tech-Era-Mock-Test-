import './index.css'
import {Component} from 'react'
import Loader from 'react-loader-spinner' // Assuming you have imported Loader from the appropriate package
import Header from '../Header'

const detailApiStatus = {
  initial: 'initial',
  inProgress: 'progress',
  success: 'success',
  failure: 'failure',
}

class CourseDetails extends Component {
  state = {
    courseDetails: {},
    apiStatus: detailApiStatus.initial,
  }

  componentDidMount() {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const getData = async () => {
      try {
        this.setState({apiStatus: detailApiStatus.inProgress})

        const response = await fetch(`https://apis.ccbp.in/te/courses/${id}`)

        if (response.ok) {
          const data = await response.json()
          const courseDetails = data.course_details
          const formattedData = {
            id: courseDetails.id,
            name: courseDetails.name,
            imageUrl: courseDetails.image_url,
            description: courseDetails.description,
          }

          this.setState({
            courseDetails: formattedData,
            apiStatus: detailApiStatus.success,
          })
        } else {
          this.setState({apiStatus: detailApiStatus.failure})
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        this.setState({apiStatus: detailApiStatus.failure})
      }
    }

    getData()
  }

  loadingView = () => (
    <>
      <Header />
      <div data-testid="loader" className="loader-con">
        <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
      </div>
    </>
  )

  failureView = () => (
    <>
      <Header />
      <div className="failure-view-bg-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/tech-era/failure-img.png"
          alt="failure view"
        />
        <h1 className="failure-title">Oops! Something Went Wrong</h1>
        <p className="failure-description">
          We cannot seem to find the page you are looking for.
        </p>
        <button type="button" onClick={this.getData()} className="retry-btn">
          Retry
        </button>
      </div>
    </>
  )

  successDetailedView = () => {
    const {courseDetails} = this.state
    const {name, description, imageUrl} = courseDetails

    return (
      <>
        <Header />
        <div className="course-details-bg-container">
          <div className="course-details-card">
            <img src={imageUrl} alt={name} className="course-full-image" />
            <div className="course-details-data">
              <h1 className="title">{name}</h1>
              <p className="description">{description}</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case detailApiStatus.inProgress:
        return this.loadingView()
      case detailApiStatus.failure:
        return this.failureView()
      case detailApiStatus.success:
        return this.successDetailedView()
      default:
        return null
    }
  }
}

export default CourseDetails
