import { useNavigate } from "react-router-dom";
const Admin = ()=>{
   const navigate = useNavigate();
   const navigationHandler = (path) => {
      navigate(path);
    };
   return (
      <div>
         <h1>Admin Page</h1>
         <br/><br/>
         <button type="button" className="btn-success" onClick={navigationHandler.bind(this,"/admin/courses")}>Course Details</button> &nbsp; &nbsp; &nbsp; &nbsp;
         <button type="Order" className="btn-success" onClick={navigationHandler.bind(this,"/admin/order")}>Order Details</button>
      </div>
    
   )
}
export default Admin;