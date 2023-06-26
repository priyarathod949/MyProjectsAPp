import {Component} from 'react'

import Loader from 'react-loader-spinner'
import Header from '../Header'
import ProjectItems from '../ProjectItems'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class Projects extends Component {
  state = {
    projectList: [],
    activeCategoryId: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjectList()
  }

  onChangeCategory = event => {
    this.setState({activeCategoryId: event.target.value}, () =>
      this.getProjectList(),
    )
  }

  getProjectList = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {activeCategoryId} = this.state
    const projectUrl = `https://apis.ccbp.in/ps/projects?category=${activeCategoryId}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(projectUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        projectList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickRetry = () => {
    this.getProjectList()
  }

  renderFailureView = () => (
    <div className="bgContainer">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failureImage"
      />
      <h1 className="description">Oops! Something Went Wrong</h1>
      <p className="para">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" onClick={this.onClickRetry} className="RetryButton">
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {projectList} = this.state
    return (
      <ul className="projectList">
        {projectList.map(each => (
          <ProjectItems key={each.id} projectItems={each} />
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loading">
      <div className="loading">
        <Loader type="ThreeDots" color="#0BFFFF" height={50} width={50} />
      </div>
    </div>
  )

  renderProjects = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {activeCategoryId} = this.state

    return (
      <>
        <Header />
        <div className="ProjectContainer">
          <select
            value={activeCategoryId}
            onChange={this.onChangeCategory}
            className="selectedInputContainer"
          >
            {categoriesList.map(each => (
              <option key={each.id} value={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
          {this.renderProjects()}
        </div>
      </>
    )
  }
}

export default Projects
