import React from "react"

class Table extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            graph: this.props.graph,
            tableData: this.props.tableData,
        }

        console.log(this.state.graph)
    }

    render(){
        return(

            <div id="myTable">
                
                <table>
                    <thead>
                        <tr>
                            <th>Parent Node</th>

                            {this.state.graph.map(header =>
                                <th>{header.name}</th>    
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {this.state.tableData.map(row =>
                            <tr>
                                <td>{row.parent.name}</td>
                                {row.values.map(cell =>
                                    <td>{cell.totalCost}</td>
                                )}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Table