import React from 'react';
//import useState from 'react';
class User extends React.Component<{ login: string, pass : string, id : number }, {count: number}> {
    state = { count: 0 };
}

export default User;