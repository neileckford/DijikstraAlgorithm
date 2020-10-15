import React, { useRef, useEffect } from 'react'

const nodeRadius = 40
const standardColor = "#000"
const standardWidth = 5
const pathColor = "#f00"
const pathWidth = 10
const parentColor = "#00f"

const Canvas = props => {

    const graph = props.graph
    const tableData = props.tabledata
  
    const canvasRef = useRef(null)

    const draw = (ctx) => {

        graph.forEach(function(node){

            drawNode(ctx, node, tableData)

            node.adjacentNodes.forEach(function(adjacent){
                drawArrows(ctx, node, adjacent, tableData)
            })

            ctx.beginPath()
        })
    }
  
    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        ctx.canvas.width = 1000
        ctx.canvas.height = 800

        ctx.fillStyle = '#0ff'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        const render = () => {
            draw(ctx)
        }
        render()
    
    }, [draw])
  
    return <canvas className="myCanvas" ref={canvasRef} {...props}/>
}

function drawNode(ctx, node, tableData){
    
    
    const x = node.x
    const y = node.y

    ctx.beginPath()
    ctx.strokeStyle = "#000"

    let parent
    if (tableData.length > 0)
        parent = tableData[tableData.length-1].parent
    
    if (parent != null){
        if (node === parent && !IsComplete(tableData)){
            ctx.strokeStyle = parentColor
        }
    }

    ctx.lineWidth = 5
    ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI)
    ctx.stroke()
    
    //node name
    let nodeName = node.name
    let totalCost = node.totalCost === Infinity ? "-" : node.totalCost
    let label = (nodeName + "(" + totalCost + ")")
    ctx.fillStyle = "#000"
    ctx.font = "18px Arial"
    let measureText = ctx.measureText(label)
    ctx.fillText(label, x - measureText.width/2, y + measureText.actualBoundingBoxAscent/2)
}

function drawArrows(ctx, node, adjacent, tableData){

    //draw path different color
    if (node.InPath && adjacent.destination.InPath){
        ctx.strokeStyle = pathColor
        ctx.lineWidth = pathWidth
    }else{
        ctx.strokeStyle = standardColor
        ctx.lineWidth = standardWidth
    }

    let parent

    if (tableData.length > 0)
        parent = tableData[tableData.length-1].parent
    
    if (parent != null){
        
        if (parent === node && !IsComplete(tableData)){
            ctx.strokeStyle = "#ff0"
        }
    }
    
    calculateCoords(ctx, node, adjacent)
}

function IsComplete(tableData){

    let IsComplete = false

    tableData.forEach(function(value){
        if (value.parent.InPath){
            IsComplete = true
        }else{
            IsComplete = false
        }
    })

    return IsComplete
}

function calculateCoords(ctx, node, adjacent){
    
    let x = node.x
    let y = node.y
    let x2 = adjacent.destination.x
    let y2 = adjacent.destination.y

    let angle = Math.atan((y2 - y) / (x2 - x))
    let slice = angle

    x = x + (nodeRadius * (Math.cos(slice)))
    x2 = x2 - (nodeRadius * (Math.cos(slice)))
    y = y + (nodeRadius * (Math.sin(slice)))
    y2 = y2 - (nodeRadius * (Math.sin(slice)))

    ctx.beginPath()
    ctx.moveTo(x,y)
    ctx.lineTo(x2,y2)
    ctx.stroke()

    drawArrowHead(ctx, x2, y2, slice)
    distanceLabel(ctx, adjacent.distance, x, y, x2, y2, slice)
}

function drawArrowHead(ctx, x2, y2, slice){

    let radius = 14
    ctx.beginPath()

    let a = slice + 5/4 * Math.PI// rotate first half of arrowhead
    let b = slice + 3/4 * Math.PI// rotate second half of arrowhead

    ctx.moveTo(x2 + (radius * (Math.cos(a))), y2 + (radius * (Math.sin(a))))
    ctx.lineTo(x2, y2)
    ctx.lineTo(x2 + (radius * (Math.cos(b))), y2 + (radius * (Math.sin(b))))
    ctx.stroke()
}

function distanceLabel(ctx, distance, x, y, x2, y2, slice){

    let paddingX = 0
    let paddingY = 0

    if (slice === 0){
        paddingX = 0
        paddingY = 20
    }

    if (slice > 1 || slice < -1){
        paddingX = 15
        paddingY = 0
    }

    if (slice < 0 && slice > -1){
        paddingX = -10
        paddingY = -10
    }

    if (slice > 0 && slice < 1){
        paddingX = 0
        paddingY = 15
    }

    x = (x + x2) / 2 + paddingX
    y = (y + y2) / 2 + paddingY

    let label = distance
    ctx.fillStyle = "#000"
    ctx.font = "18px Arial"
    let measureText = ctx.measureText(label)
    ctx.fillText(label, x - measureText.width/2, y + measureText.actualBoundingBoxAscent/2)
}

export default Canvas