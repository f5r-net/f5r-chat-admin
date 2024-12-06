import React from 'react';
import { connect } from 'react-redux';
import { getCountries, getAllRooms } from '../actions/room';
import { getAllUsers, logout } from '../actions/user';

class Dashboard extends React.Component {
    componentDidMount() {
        this.props.getCountries();
        this.props.getAllRooms();
        this.props.getAllUsers();
    }

    render() {
        const { rooms } = this.props.roomState;
        const { users } = this.props.userState;

        return (
            <div>
                <h1>Dashboard</h1>
                <div>
                    <h3>Total Rooms: {rooms.length}</h3>
                    <h3>Total Users: {users.length}</h3>
                </div>
            </div>
        );
    }
}

const mapState = (state) => ({
    roomState: state.roomState,
    userState: state.userState,
});

export default connect(mapState, { getCountries, getAllRooms, getAllUsers, logout })(Dashboard);
