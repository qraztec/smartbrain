import React from 'react';

class Rank extends React.Component{
    render() {
    return (
        <div>
            <div className = "white f3">
                {`${this.props.name}, your current entry count is...`}
            </div>
            <div className = "white f3">
                {this.props.entries}
            </div>
        </div>
    )
}
}


export default Rank