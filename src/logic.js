import React from "react"
import "./index.css"
import Table from "./table"
import Canvas from "./canvas"

class TableData{

    constructor(parent, values){
        this.parent = parent
        this.values = values
    }
}

class Logic extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            graph: this.props.graph,
            unresolvedNodes: this.initUnresolvedNodes(this.props.graph),
            tableData: []
        }
    }

    initUnresolvedNodes(graph){

        let unresolvedNodes = []

        graph.forEach(function(value, i){
            // do not add Finish node as this does not need to be resolved
            if (i != graph.length-1) 
                unresolvedNodes.push(value)
        })

        return unresolvedNodes
    }

    main() {

        let shortestPath = this.getShortestPath()
        return shortestPath
    }

    getLowestCostNode(){

        let lowestCostNode = null
        let shortestCost = Infinity

        this.state.unresolvedNodes.forEach(function(value){
            if (value.totalCost < shortestCost){

                shortestCost = value.totalCost
                lowestCostNode = value
            }
        })
           
        lowestCostNode.IsLowestCost = true
        return lowestCostNode
    }

    getShortestPath(){

        let finalGraph = this.state.graph

        let parentNode = finalGraph[finalGraph.length-1]
        let lowestCostPath = []

        while (parentNode){

            parentNode.InPath = true
            let currentNode = parentNode          
            lowestCostPath.push(parentNode)
            parentNode = currentNode.parent
        }

        return lowestCostPath.reverse()
    }

    handleClick = () =>{

        if (this.state.unresolvedNodes.length > 0)
            this.evaluateNextNode()
    }

    evaluateNextNode(){

        let parentNode = this.getLowestCostNode(this.state.unresolvedNodes)

        parentNode.adjacentNodes.forEach(function(value){

            let totalCostToChild = parentNode.totalCost + value.distance

            // set total cost if lower than existing total cost of adjacent node
            if (totalCostToChild < value.destination.totalCost){
                
                value.destination.totalCost = totalCostToChild
                value.destination.parent = parentNode
            }
        })

        // remove node from list of unresolved nodes
        this.state.unresolvedNodes.splice(this.state.unresolvedNodes.indexOf(parentNode),1)

        // add row to table data
        let values = []
        
        this.state.graph.forEach(function(value){
            values.push(value.totalCost === Infinity ? "-" : value)
        })

        let tableRow = new TableData(parentNode, values)
        
        this.setState(prevState =>{

            let data = prevState.tableData
            data.push(tableRow)
            return {
                tableData: data
            }
        })

        parentNode.IsResolved = true
    }
    
    render(){

        let path = [];

        if (this.state.unresolvedNodes.length < 1){
            path = this.main()
        }

        return(
            <div>

                <input type="button" value="Evaluate Node" onClick={this.handleClick.bind(this)} />
                
                <Table graph={this.state.graph} tableData={this.state.tableData} />
                <Canvas graph={this.state.graph} tabledata={this.state.tableData}/>
                

                {path.map(a => 
                    <h3>{a.name}</h3>    
                )}          

                <h3>{this.state.graph[this.state.graph.length - 1].totalCost}</h3>
            </div>
        );
    }
}

export default Logic