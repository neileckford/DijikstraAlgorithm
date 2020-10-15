import React from "react"
import "./index.css"
import NodeModel from "./nodemodel"
import Logic from "./logic"

class App extends React.Component{


    initGraph(){

        const start = new NodeModel("Start",1,2)
        const nodeA = new NodeModel("A",2,1)
        const nodeB = new NodeModel("B",2,3)
        const nodeC = new NodeModel("C",4,1)
        const nodeD = new NodeModel("D",4,3)
        const finish = new NodeModel("Finish",5,2)

        start.addDestination(nodeA, 5)
        start.addDestination(nodeB, 2)
        nodeA.addDestination(nodeC, 4)
        nodeA.addDestination(nodeD, 2)
        nodeB.addDestination(nodeA, 5)
        nodeB.addDestination(nodeD, 7)
        nodeC.addDestination(nodeD, 6)
        nodeC.addDestination(finish, 5)
        nodeD.addDestination(finish, 9)

        // add to graph
        const graph = []
        graph.push(start)
        start.totalCost = 0
        graph.push(nodeA)
        graph.push(nodeB)
        graph.push(nodeC)
        graph.push(nodeD)
        graph.push(finish)

        return graph
    }
    
    render(){
        return(
            <div>
                <Logic graph={this.initGraph()} />
            </div>
        );
    }
}

export default App