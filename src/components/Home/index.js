import {Component} from 'react'
import './index.css'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner' // Assuming you have imported Loader from the appropriate package
import Header from '../Header'

const apiStatus = {
  initial: 'initial',
  inProgress: 'progress',
  success: 'success',
  failure: 'failure',
}

class Home extends Component {
  state = {
    courses: [],
    status: apiStatus.initial,
  }

  componentDidMount() {
    this.getApiData()
  }

  getApiData = async () => {
    this.setState({status: apiStatus.inProgress})

    try {
      const response = await fetch('https://apis.ccbp.in/te/courses')

      if (response.ok === true) {
        const data = await response.json()
        const formattedData = data.courses.map(each => ({
          id: each.id,
          name: each.name,
          logoUrl: each.logo_url,
        }))

        this.setState({courses: formattedData, status: apiStatus.success})
      } else {
        this.setState({status: apiStatus.failure})
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      this.setState({status: apiStatus.failure})
    }
  }

  loadingView = () => (
    <>
      <Header />
      <div data-testid="loader" className="loader-con">
        <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
      </div>
    </>
  )

  successView = () => {
    const {courses} = this.state

    return (
      <>
        <Header />
        <div className="home-main-container">
          <h1 className="courses-heading">Courses</h1>
          <ul className="list-of-courses">
            {courses.map(each => (
              <Link
                to={`/courses/${each.id}`}
                key={each.id}
                className="link-item"
              >
                <li className="course-item">
                  <img
                    src={each.logoUrl}
                    alt={each.name}
                    className="course-image"
                  />
                  <p className="course-name">{each.name}</p>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </>
    )
  }

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
        <button type="button" onClick={this.getApiData} className="retry-btn">
          Retry
        </button>
      </div>
    </>
  )

  finalView = () => {
    const {status} = this.state

    switch (status) {
      case apiStatus.success:
        return this.successView()
      case apiStatus.failure:
        return this.failureView()
      case apiStatus.inProgress:
        return this.loadingView()
      default:
        return null
    }
  }

  render() {
    return this.finalView()
  }
}

export default Home
