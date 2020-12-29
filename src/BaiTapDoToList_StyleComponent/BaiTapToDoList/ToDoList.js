import React, { Component } from 'react'
import { Container } from '../Components/Container'
import { ThemeProvider } from 'styled-components'
import { ToDoListDarkTheme } from '../Theme/ToDoListDarkTheme'
import { ToDoListLightTheme } from '../Theme/ToDoListLightTheme'
import { ToDoListPrimaryTheme } from '../Theme/ToDoListPrimaryTheme'
import { Dropdown } from '../Components/Dropdown'
import { Input, Label, TextField } from '../Components/TextField'
import { Button } from '../Components/Button'
import { Heading3, Heading5, Heading4 } from '../Components/Heading'
import { Table, Td, Thead, Tr, Th } from '../Components/Table'
import { connect } from 'react-redux'
import { arrTheme } from '../Theme/ThemeManager'
import { addTaskAction, changeThemeAction, deleteTaskAction, doneTaskAction, editTaskAction, updateTaskAction } from '../../Redux/Action/ToDoListAction'

import Axios from 'axios'

class ToDoList extends Component {

    state = {
        taskName: '',
        disabled: true,
        taskList: [

        ],

        values: {
            taskName: "",
        },

        error: {
            taskName: "",
        }
    }

    renderTaskToDo = () => {
        return this.state.taskList.filter(task => !task.status).map((task, index) => {
            return <Tr key={index}>
                <Th style={{ verticalAlign: "middle" }} >{task.taskName}</Th>
                <Th className="text-right" >
                    <Button onClick={() => {

                        this.setState({
                            disabled: false
                        }, () => {
                            this.props.dispatch(editTaskAction(task))
                        })

                    }} className="ml-1" ><i class="fa fa-edit"></i></Button>


                    <Button type = "button" onClick={() => {
                        this.checkTask(task.taskName)
                    }} className="ml-1" ><i class="fa fa-check"></i></Button>


                    <Button type = "button" onClick={() => {
                        this.delTask(task.taskName)
                    }} className="ml-1" ><i class="fa fa-trash-alt"></i></Button>
                </Th>
            </Tr>

        })
    }

    renderTaskCompleted = () => {
        return this.state.taskList.filter(task => task.status).map((task, index) => {
            return <Tr key={index}>
                <Th style={{ verticalAlign: "middle" }} >{task.taskName}</Th>
                <Th className="text-right">
                    <Button type = "button" onClick={() => {
                        this.delTask(task.taskName)
                    }} ><i class="fa fa-trash-alt"></i></Button>
                    <Button className = "ml-1" type = "button" onClick={() => {
                        this.rejectTask(task.taskName)
                    }} ><i class="fa fa-undo"></i></Button>
                </Th>
            </Tr>
        })
    }

    getTaskList = () => {
        let promise = Axios({
            url: 'http://svcy.myclass.vn/api/ToDoList/GetAllTask',
            method: 'GET',
        })

        promise.then((result) => {
            console.log(result.data)
            // Nếu gọi API lấy về kết quả thành công 
            // Set lại state của component
            this.setState({
                taskList: result.data
            })
        })

        promise.catch((err) => {
            console.log(err.response.data)
            console.log('thất bại')
        })
    }

    // Viết hàm renderTheme

    renderTheme = () => {
        return arrTheme.map((theme, index) => {
            return <option value={theme.id} key={index}>
                {theme.name}
            </option>
        })
    }

    // Hàm xử lý change nhập liệu
    handleChange = (e) => {
        let { value, name } = e.target;

        // Xử lý sét giá trị nhập liệu mới
        let newValues = { ...this.state.values };
        newValues = { ...newValues, [name]: value };

        // Xử lý lỗi
        let newError = { ...this.state.error }

        let regexString = /^[a-z A-z]+$/

        if (value.trim() === "") {
            newError[name] = name + "is require"
        } else {
            newError[name] = ""
        }

        this.setState({
            ...this.state,
            values: newValues,
            error: newError
        }, () => {
            console.log(this.state.values)
            console.log(this.state.error)
        })
    }

    // Hàm thêm task
    addTask = (e) => {
        e.preventDefault();
        console.log(this.state.values.taskName)

        let promise = Axios({
            url: 'http://svcy.myclass.vn/api/ToDoList/AddTask',
            method: 'POST',
            data: {taskName: this.state.values.taskName}

        })

        // Xử lý hàm thành công
        promise.then(result => {
            console.log(result.data);
            this.getTaskList();
            // alert("addtask success")
        })

        // Xử lý thất bại
        promise.catch(errors => {
            console.log(errors.response.data)
            alert('task is exits')
        })

    }

    // Hàm xóa task
    delTask = (taskName) => {

        let promise = Axios({
            url: `http://svcy.myclass.vn/api/ToDoList/deleteTask?taskName=${taskName}`,
            method: 'DELETE'
        });

        promise.then(result => {
            alert(result.data)
            this.getTaskList()
        });

        promise.catch(errors => {
            alert(errors.response.data)
        })
    }

    // Xử lý doneTask
    checkTask = (taskName) => {
        let promise = Axios({
            url: `http://svcy.myclass.vn/api/ToDoList/doneTask?taskName=${taskName}`,
            method: 'PUT'
        })

        promise.then(result => {
            alert(result.data)
            this.getTaskList()
        })

        promise.catch(err => {
            alert(err.response.data)
        })
    }

    // Xử lý rejectTask 
    rejectTask = (taskName) => {
        let promise = Axios({
            url: `http://svcy.myclass.vn/api/ToDoList/rejectTask?taskName=${taskName}`,
            method: 'PUT'
        })

        promise.then(result => {
            alert(result.data)
            this.getTaskList()
        })

        promise.catch(err => {
            alert(err.response.data);
        })
    }

    // Lifecycle bảng dưới 16.4 nhận vào props mới được thực thi trước render
    // componentWillReceiveProps(newProps){
    //     this.setState({
    //         taskName: newProps.taskEdit.taskName
    //     })
    // }

    // // Lifecycle tĩnh không truy xuất được trỏ this
    // static getDerivedStateFromProps(newProps, currentState) {

    //     // newProps: là props mới, props cũ là this.props (không truy xuất được)
    //     // CurrentState ứng với state hiện tại this.state

    //     // Hoặc trả về state mới (this.state)
    //     let newState = { ...currentState, taskName: newProps.taskEdit.taskName }

    //     return newState
    //     // trả về null state giữ nguyên
    //     //return null
    // }

    

    render() {
        return (
            <ThemeProvider theme={this.props.themeToDoList}>
                <Container>
                    <form onSubmit = {this.addTask}>
                        {/* <Button onClick={this.getTaskList}>Get taskList</Button> */}
                        <Dropdown onChange={(e) => {
                            let { value } = e.target

                            // Gửi value lên dispatch để thực hiện thay đổi redux
                            this.props.dispatch(changeThemeAction(value))

                        }}>

                            {this.renderTheme()}
                            {/* <option>Dark Theme</option>
                        <option>Light Theme</option>
                        <option>Primary Theme</option> */}
                        </Dropdown>
                        <Heading3>To do list</Heading3>
                        {/* <Label>Task name</Label>
                    <br></br>
                    <Input className = "w-50" ></Input> */}

                        <TextField name="taskName" onChange={this.handleChange} lable="Task name" className="w-50" ></TextField>
                        <Heading4 className="text-danger" >{this.state.error.taskName}</Heading4>

                        <Button type="submit" onClick={this.addTask} className="ml-2"><i class="fa fa-plus"></i> Add task</Button>

                        {this.state.disabled ?
                            <Button disabled onClick={() => {
                                this.props.dispatch(updateTaskAction(this.state.taskName))
                            }} className="ml-2" ><i class="fa fa-upload"></i> Update Task</Button> :

                            <Button onClick={() => {

                                let { taskName } = this.state
                                this.setState({
                                    disabled: true,
                                    taskName: ''
                                }, () => {
                                    this.props.dispatch(updateTaskAction(taskName))
                                })


                            }} className="ml-2" ><i class="fa fa-upload"></i> Update Task</Button>
                        }


                        <hr></hr>
                        <Heading3>Task to do</Heading3>
                        <Table>
                            <Thead>
                                {this.renderTaskToDo()}
                                {/* <Tr>
                                <Th style={{ verticalAlign: "middle" }} >Task name</Th>
                                <Th className="text-right" >
                                    <Button className="ml-1" ><i class="fa fa-edit"></i></Button>
                                    <Button className="ml-1" ><i class="fa fa-check"></i></Button>
                                    <Button className="ml-1" ><i class="fa fa-trash-alt"></i></Button>
                                </Th>
                            </Tr>

                            <Tr>
                                <Th style={{ verticalAlign: "middle" }} >Task name</Th>
                                <Th className="text-right" >
                                    <Button className="ml-1" ><i class="fa fa-edit"></i></Button>
                                    <Button className="ml-1" ><i class="fa fa-check"></i></Button>
                                    <Button className="ml-1" ><i class="fa fa-trash-alt"></i></Button>
                                </Th>
                            </Tr> */}

                            </Thead>
                        </Table>

                        <Heading3>Task completed</Heading3>
                        <Table>
                            <Thead>
                                {this.renderTaskCompleted()}
                                {/* <Tr>
                                <Th style={{ verticalAlign: "middle" }} >Task name</Th>
                                <Th className="text-right">
                                    <Button><i class="fa fa-trash-alt"></i></Button>
                                </Th>
                            </Tr>

                            <Tr>
                                <Th style={{ verticalAlign: "middle" }} >Task name</Th>
                                <Th className="text-right">
                                    <Button><i class="fa fa-trash-alt"></i></Button>
                                </Th>
                            </Tr> */}
                            </Thead>
                        </Table>

                    </form>

                </Container>
            </ThemeProvider>
        )
    }

    componentDidMount() {
        this.getTaskList()
    }

    // Đây là lifecycle trả về props cũ và state cũ của component trước khi render. Nhưng licycle này chạy sau render
    componentDidUpdate(prevProps, prevState) {
        // So sánh nếu như props trước đó mà (taskEdit trước mà khác taskEdit hiện tại thì mình mới setState)

        if (prevProps.taskEdit.id !== this.props.taskEdit.id) {
            this.setState({
                taskName: this.props.taskEdit.taskName
            })
        }
    }
}



const mapStateToProps = (state) => {
    return {
        taskList: state.ToDoListReducer.taskList,
        themeToDoList: state.ToDoListReducer.themeToDoList,
        taskEdit: state.ToDoListReducer.taskEdit
    }
}

export default connect(mapStateToProps)(ToDoList)