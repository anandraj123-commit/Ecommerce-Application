
import { useState, useEffect, useRef} from 'react';
import axios from 'axios';
import Card from '../ui/Card';
import '../asset/public.css';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [id,setId] = useState('');
    const inputCourseRef1 = useRef();
    const textAreaRef1 = useRef();
    const priceRef1 = useRef();
    const imageUrlRef1 = useRef();
    const inputCourseRef = useRef();
    const textAreaRef = useRef();
    const priceRef = useRef();
    const imageUrlRef = useRef();

    const apiUrl = process.env.REACT_APP_API_URL;
    

    //'http://localhost:5001/api/courses'

    useEffect(() => {
        axios.get(`${apiUrl}/api/courses`)
            .then(response => setCourses(response.data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);
    
    function addCourseHandler(event){
        event.preventDefault();
        if(!inputCourseRef1.current.value || !textAreaRef1.current.value || !priceRef1.current.value || !imageUrlRef1.current.value) {
            inputCourseRef1.current.value = '';
            textAreaRef1.current.value = '';
            priceRef1.current.value = '';
            imageUrlRef1.current.value = '';
            return;
        }
        let course = {
            name : inputCourseRef1.current.value,
            description :textAreaRef1.current.value,
            price : priceRef1.current.value,
            image : imageUrlRef1.current.value
       }

       //http://localhost:5001/api/courses

        axios.post(`${apiUrl}/api/courses`,course)
        .then(response => {
            inputCourseRef1.current.value = '';
            textAreaRef1.current.value = '';
            priceRef1.current.value = '';
            imageUrlRef1.current.value = '';
            setCourses((prev)=>{
                return [response.data,...prev]
            })
        })
        .catch(error => console.error('Error adding products:', error));
    }

    function updateCourseHandler(event){
        event.preventDefault();
        let course = {
             name : inputCourseRef.current.value,
             description :textAreaRef.current.value,
             price : priceRef.current.value,
             image : imageUrlRef.current.value
        }
        console.log("id",id);
        console.log("Course",course);
        //http://localhost:5001/api/course/${id}

        axios.patch(`${apiUrl}/api/course/${id}`,course)
        .then(response => {
            console.log("courses",courses);
            var foundIndex = courses.findIndex(x => x.id === id);
            console.log("courses[foundIndex]",courses[foundIndex]);
            setCourses(prev=>{ 
                prev[foundIndex] = {...prev[foundIndex],...course};
                return prev;
             });
        })
        .catch(error => console.error('Error updating products:', error));
    }

    function openUpdatePopup(course){
        setId(course.id);
        inputCourseRef.current.value = course.name;
        textAreaRef.current.value = course.description;
        priceRef.current.value = course.price;
        imageUrlRef.current.value = course.image;
    }

    function removeCourseHandler(id){
        let courseExist = courses.find(p=>{
          return p.id === id
        })
        if(courseExist){
          axios.delete(`${apiUrl}/api/course/${id}`)
          .then(response => {
            setCourses(prev=>{
              return prev.filter(course=> {
                return course.id !== id
              })
            })
          }).catch(error => console.error('Error adding to cart:', error));
        }
        }

    return (
        <div class="couse-page">
            <div class="course-page_addCourse">
                <h1>Courses Page</h1>
                {/* <button type="button" class="btn-sm btn-primary" >Add Course</button> */}
                {/* <button type="button" class="btn-sm btn-primary" >Add Course</button> */}
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal" style={{ width: "120px", height: "40px", margin: "10px" }}> Add Course</button>
                <div class="modal fade" id="myModal">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">Add Courses</h4>
                                <button type="button" class="close" data-dismiss="modal">×</button>
                            </div>
                            <div class="modal-body mx-auto " style={{ width: "100%" }}>
                                <Card>
                                    <form>
                                        <div class="form-group">
                                            <label for="uname">Course Name:</label>
                                            <input type="text" ref={inputCourseRef1} class="form-control" id="uname" placeholder="Enter username" name="uname" />
                                        </div>
                                        <div class="form-group">
                                            <label for="course_desc">Course Description:</label>
                                            <textarea type="text" ref={textAreaRef1} class="form-control" id="uname" placeholder="Enter username" name="courseDesc"></textarea>
                                        </div>
                                        <div class="form-group">
                                            <label for="imageUrl">Image Url</label>
                                            <input type="text" ref={imageUrlRef1} class="form-control" id="imageUrl" placeholder="Enter username" name="imageUrl"/>
                                        </div>
                                        <div class="form-group">
                                            <label for="course_price">Course Price:</label>
                                            <input type="number" ref={priceRef1} class="form-control" id="coursePrice" placeholder="Enter username" name="coursePrice"></input>
                                        </div>
                                        <button type="submit" class="btn btn-primary" onClick={addCourseHandler} data-dismiss="modal">Submit</button>
                                    </form>
                                </Card>
                            </div>
                            {/* <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
        </div> */}
                        </div>
                    </div>
                </div>


                <div class="modal fade" id="myModalupdate">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">Update Course</h4>
                                <button type="button" class="close" data-dismiss="modal">×</button>
                            </div>
                            <div class="modal-body mx-auto " style={{ width: "100%" }}>
                                <Card>
                                    <form>
                                        <div class="form-group">
                                            <label for="uname">Course Name:</label>
                                            <input type="text" ref= {inputCourseRef} class="form-control" id="uname" placeholder="Enter username" name="uname" />
                                        </div>
                                        <div class="form-group">
                                            <label for="course_desc">Course Description:</label>
                                            <textarea type="text" ref={textAreaRef} class="form-control" id="uname" placeholder="Enter username" name="courseDesc"></textarea>
                                        </div>
                                        <div class="form-group">
                                            <label for="imageUrl">Image Url</label>
                                            <input type="text" class="form-control"  id="imageUrl" ref={imageUrlRef} placeholder="Enter username" name="imageUrl"/>
                                        </div>
                                        <div class="form-group">
                                            <label for="course_price">Course Price:</label>
                                            <input type="number" class="form-control" id="coursePrice" ref={priceRef}  placeholder="Enter username" name="coursePrice"></input>
                                        </div>
                                        <button type="submit" onClick={updateCourseHandler} class="btn btn-primary" data-dismiss="modal">update</button>
                                    </form>
                                </Card>
                            </div>
                            {/* <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
        </div> */}
                        </div>
                    </div>
                </div>
            </div>
            <table class="table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course, index) => {
                        return (<tr key={index}>
                            <td>{index + 1}</td>
                            <td><img alt={course.name} src={course.image} width="50px" height="50px" /></td>
                            <td><h2>{course.name}</h2></td>
                            <td><h2>{course.description}</h2></td>
                            <td><h2>{course.price}</h2></td>
                            <td> <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#myModalupdate" onClick={openUpdatePopup.bind(this,course)}>Edit</button></td>
                            <td><button class="btn-danger" onClick={removeCourseHandler.bind(this,course.id)}>Delete</button></td>
                        </tr>)
                    })}
                </tbody>
            </table>
        </div>

    )

}
export default Courses;