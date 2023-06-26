import './index.css'

const ProjectItems = props => {
  const {projectItems} = props
  const {imageUrl, name} = projectItems

  return (
    <li className="projectItemContainer">
      <img src={imageUrl} alt={name} className="projectImage" />
      <p className="name">{name}</p>
    </li>
  )
}

export default ProjectItems
