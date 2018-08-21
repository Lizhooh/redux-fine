import React, { Component } from 'react';
import Fine from '../redux/fine';
import { connect } from 'react-redux';

export default connect(
    state => ({ state: state.index }),
    Fine.action('index'),
)(class extends Component {
    constructor(props) {
        super(props);
        this.text = '';
    }
    render() {
        const { list = [] } = this.props.state;
        const { addItem, removeItem } = this.props;

        return (
            <div>
                <p style={styles.title}>To Do List</p>

                <div style={styles.center}>
                    <input
                        style={{ marginRight: 12 }}
                        placeholder="输入内容"
                        onChange={e => this.text = e.target.value}
                    />
                    <button onClick={e => addItem(this.text)}>添加</button>
                </div>

                <ol style={{ ...styles.center, marginTop: 20, flexDirection: 'column' }}>
                    {list.length > 0 ? list.map((item, index) => (
                        <li key={index} style={{ width: 200, marginTop: 8 }}>
                            <span>{item.text} </span>
                            <button onClick={e => removeItem(item.id)}>删除</button>
                        </li>
                    )) : <span>空</span>}
                </ol>
            </div>
        );
    }
});

const styles = {
    title: {
        textAlign: 'center',
        fontSize: 30
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#444',
    },
}
