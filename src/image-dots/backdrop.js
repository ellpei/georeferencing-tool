

const Backdrop = (props) => (
    props.show ? <div className="modal-backdrop" onClick={props.clicked}></div> : null
)

export default Backdrop;