const DeleteConfirmModel = ({ open, setOpen, onConfirm }) => {
  return (
    <dialog open={open} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirm Delete</h3>
        <p className="py-4">Are you sure you want to delete?</p>

        <div className="modal-action">
          <button className="btn" onClick={() => setOpen(false)}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteConfirmModel;
