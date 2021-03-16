//this is for navigation and calculating piece moves
const cols=['A','B','C','D','E','F','G','H'] 
const rows=['1','2','3','4','5','6','7','8']
const centerVals={
    A8:0,B8:0,C8:0,D8:1,E8:1,F8:0,G8:0,H8:0,
    A7:0,B7:1,C7:1,D7:1,E7:1,F7:1,G7:1,H7:0,
    A6:0,B6:1,C6:1,D6:1,E6:1,F6:1,G6:1,H6:0,
    A5:0,B5:1,C5:2,D5:2,E5:2,F5:1,G5:1,H5:0,
    A4:0,B4:1,C4:2,D4:2,E4:2,F4:1,G4:1,H4:0,
    A3:0,B3:1,C3:1,D3:1,E3:1,F3:1,G3:1,H3:0,
    A2:0,B2:1,C2:1,D2:1,E2:1,F2:1,G2:1,H2:0,
    A1:0,B0:0,C0:0,D0:1,E0:1,F0:0,G0:0,H0:0,
}
//for the COMPUTER ONLY (global variable)
let currentAttacks 
let currentAttacked = 0
let attackedCount = 0

//for the 3-move draw rule
let duplicatedPositions=[]
let legalMoves=[]
let positions=[]
let moveRecord=[]

let board = {
    squares:{
        A8:"",B8:"",C8:"",D8:"",E8:"",F8:"",G8:"",H8:"",
        A7:"",B7:"",C7:"",D7:"",E7:"",F7:"",G7:"",H7:"",
        A6:"",B6:"",C6:"",D6:"",E6:"",F6:"",G6:"",H6:"",
        A5:"",B5:"",C5:"",D5:"",E5:"",F5:"",G5:"",H5:"",
        A4:"",B4:"",C4:"",D4:"",E4:"",F4:"",G4:"",H4:"",
        A3:"",B3:"",C3:"",D3:"",E3:"",F3:"",G3:"",H3:"",
        A2:"",B2:"",C2:"",D2:"",E2:"",F2:"",G2:"",H2:"",
        A1:"",B1:"",C1:"",D1:"",E1:"",F1:"",G1:"",H1:"",
    },
}
let gameStates={
    wToMove:true,
    wCheck:false,
    wCheckMate:false,
    wStaleMate:false,
    wKingMoved:false,
    wIsQueening:"",
    wQueenFrom:"",
    bCheck:false,
    bCheckMate:false,
    bStaleMate:false,
    bKingMoved:false,
    bIsQueening:"",
    bQueenFrom:"",
    A1RookMoved:false,
    A8RooMoved:false,
    H1RookMoved:false,
    H8RookMoved:false,
    sincePawnOrCapture:0,
}
//the white piece types, points, and captured data
const white = {
    R:{
        color:'white',
        name:'rook',
        value:50,
        icon:`<i class="fas w fa-chess-rook"></i>`,
        moves(curPos,isAttack){
            const x = curPos.charAt(0)
            const y = curPos.charAt(1)
            const xInd = cols.indexOf(x)
            const yInd = rows.indexOf(y)
            let rMoves = []
            //right
            for(let i = xInd+1;i<cols.length;i++){
                if(board.squares[cols[i]+y].color){
                    //If this is run with "attack squares" being true, white pieces show up before being blocked
                    if(board.squares[cols[i]+y].color==this.color&&!isAttack){
                        break
                        
                    }else{
                        rMoves.push(cols[i]+y)
                        break
                    }
                }else
                rMoves.push(cols[i]+y)
            }
            //right
            for(let i = xInd-1;i>=0;i--){
                if(board.squares[cols[i]+y].color){
                    if(board.squares[cols[i]+y].color==this.color&&!isAttack){
                        break
                    }else{
                        rMoves.push(cols[i]+y)
                        break
                    }
                }else
                rMoves.push(cols[i]+y)
            }
            //up
            for(let i = yInd+1;i<rows.length;i++){
                if(board.squares[x+rows[i]].color){
                    if(board.squares[x+rows[i]].color==this.color&&!isAttack){
                        break
                        
                    }else{
                        rMoves.push(x+rows[i])
                        break
                    }
                }else
                rMoves.push(x+rows[i])
            }
             //down
             for(let i = yInd-1;i>=0;i--){
                if(board.squares[x+rows[i]].color){
                    if(board.squares[x+rows[i]].color==this.color&&!isAttack){
                        break
                        
                    }else{
                        rMoves.push(x+rows[i])
                        break
                    }
                }else
                rMoves.push(x+rows[i])
            }
            if(!gameStates.wToMove&&!isAttack) rMoves=[]
            return rMoves
        },
        attackSqrs(curPos){
            return this.moves(curPos,true)
        }
    },
    N:{
        color:'white',
        name:'knight',
        value:30,
        icon:`<i class="fas w fa-chess-knight"></i>`,
        moves(curPos,isAttack){
            const x = curPos.charAt(0)
            const y = curPos.charAt(1)
            const xInd = cols.indexOf(x)
            const yInd = rows.indexOf(y)
            let nMoves =[]
            let nMoves2 = []
                nMoves.push(
                    cols[xInd-1]+rows[yInd-2],
                    cols[xInd+1]+rows[yInd-2],
                    cols[xInd-2]+rows[yInd+1],
                    cols[xInd-2]+rows[yInd-1],
                    cols[xInd-1]+rows[yInd+2],
                    cols[xInd+1]+rows[yInd+2],
                    cols[xInd+2]+rows[yInd+1],
                    cols[xInd+2]+rows[yInd-1]
                )
                nMoves.forEach(move=>{
                    if(move.length==2){
                        nMoves2.push(move)
                    }
                }) 
                nMoves=[]
                nMoves2.forEach(move=>{
                    //if the square is occupied
                    if(board.squares[move]){
                        //if the square is the same color
                        if(board.squares[move].color==this.color&&isAttack){
                            nMoves.push(move)
                        } else if(board.squares[move].color==this.color&&!isAttack){
                    //if the square is the enemy color       
                        } else{
                            nMoves.push(move)
                        }
                    }else{
                        nMoves.push(move)
                    }
                })
            if(!gameStates.wToMove&&!isAttack) nMoves=[]
            return nMoves
        },
        attackSqrs(curPos){
            return this.moves(curPos,true)
        },
        
    },
    B:{
        color:'white',
        name:'bishop',
        value:30,
        icon:`<i class="fas w fa-chess-bishop"></i>`,
        moves(curPos,isAttack){
            const x = curPos.charAt(0)
            const y = curPos.charAt(1)
            const xInd = cols.indexOf(x)
            const yInd = rows.indexOf(y)
            let bMoves = []
            let bMoves2 = []

                //left-up
                   for(let i = xInd+1;i<cols.length;i++){
                       let j = i-xInd
                       let Sqr = cols[i]+rows[yInd+j]
                       //if a square is blocking
                       if(board.squares[Sqr]){
                            //if same color
                            if(board.squares[Sqr].color==this.color&&isAttack){
                                bMoves.push(Sqr)
                                break
                            }else if(board.squares[Sqr].color==this.color){
                                break
                            }else{
                                bMoves.push(Sqr)
                                break
                            }

                       }else bMoves.push(Sqr)
                }
                //right-up
                for(let i = xInd-1;i>=0;i--){
                      let j = i-xInd
                      let Sqr = cols[i]+rows[yInd-j]
                     //if a square is blocking
                     if(board.squares[Sqr]){
                        //if same color
                        if(board.squares[Sqr].color==this.color&&isAttack){
                            bMoves.push(Sqr)
                            break
                        }else if(board.squares[Sqr].color==this.color){
                            break
                        }else{
                            bMoves.push(Sqr)
                            break
                        }

                   }else bMoves.push(Sqr)
                }
                 //left-down
                 for(let i = yInd-1;i>=0;i--){
                     let j = i-yInd
                     let Sqr = cols[xInd+j]+rows[i]
                    //if a square is blocking
                    if(board.squares[Sqr]){
                        //if same color
                        if(board.squares[Sqr].color==this.color&&isAttack){
                            bMoves.push(Sqr)
                            break
                        }else if(board.squares[Sqr].color==this.color){
                            break
                        }else{
                            bMoves.push(Sqr)
                            break
                        }

                   }else bMoves.push(Sqr)
                }
                for(let i = yInd-1;i>=0;i--){
                    let j = i-yInd
                    let Sqr = cols[xInd-j]+rows[i]
                 //if a square is blocking
                 if(board.squares[Sqr]){
                    //if same color
                    if(board.squares[Sqr].color==this.color&&isAttack){
                        bMoves.push(Sqr)
                        break
                    }else if(board.squares[Sqr].color==this.color){
                        break
                    }else{
                        bMoves.push(Sqr)
                        break
                    }

               }else bMoves.push(Sqr)
               }
               bMoves.forEach(move=>{
                if(move.length==2){
                    bMoves2.push(move)
                }
                }) 
                
            if(!gameStates.wToMove&&!isAttack) bMoves2=[]
            return bMoves2
        },
        attackSqrs(curPos){
            return this.moves(curPos,true)
        },
        
    },
    Q:{
        color:'white',
        name:'queen',
        value:90,
        icon:`<i class="fas w fa-chess-queen"></i>`,
        moves(curPos,isAttack){
            let diagMoves=white.R.moves(curPos,isAttack)
            let horzMoves=white.B.moves(curPos,isAttack)
            let allMoves= diagMoves.concat(horzMoves)
            if(!gameStates.wToMove&&!isAttack) allMoves=[]
            return allMoves.flat(2)
        },
        attackSqrs(curPos){
            return this.moves(curPos,true)
        },
        
    },
    K:{
        color:'white',
        name:'king',
        value:1000,
        icon:`<i class="fas w fa-chess-king"></i>`,
        moves(curPos,isAttack){
            const x = curPos.charAt(0)
            const y = curPos.charAt(1)
            const xInd = cols.indexOf(x)
            const yInd = rows.indexOf(y)
            let kMoves=[]
            let kMoves2=[]
            if(!gameStates.A1RookMoved&&!gameStates.wKingMoved){
                kMoves.push("C1")
            }
            if(!gameStates.H1RookMoved&&!gameStates.wKingMoved){
                kMoves.push("G1")
            }
            kMoves.push(
                cols[xInd+1]+rows[yInd-1],
                cols[xInd+1]+rows[yInd+1],
                cols[xInd+1]+rows[yInd],
                cols[xInd-1]+rows[yInd-1],
                cols[xInd-1]+rows[yInd+1],
                cols[xInd-1]+rows[yInd],
                cols[xInd]+rows[yInd+1],
                cols[xInd]+rows[yInd-1]
            )
            kMoves.forEach(move=>{
                if(move.length==2){
                    kMoves2.push(move)
                }
            }) 
            kMoves=[]
            kMoves2.forEach(move=>{
                //if the square is occupied
                if(board.squares[move]){
                    //if the square is the same color
                    if(board.squares[move].color==this.color&&isAttack){
                        kMoves.push(move)
                    } else if(board.squares[move].color==this.color&&!isAttack){
                //if the square is the enemy color       
                    } else{
                        kMoves.push(move)
                    }
                }else{
                    kMoves.push(move)
                }
            })

            //castling kingside
            if(!gameStates.wToMove&&!isAttack) kMoves=[]
            return kMoves
        },
        attackSqrs(curPos){
            return this.moves(curPos,true)
        },
    },
    P:{
        color:'white',
        name:'pawn',
        value:10,
        icon:`<i class="fas w fa-chess-pawn"></i>`,
        moves(curPos){
            const x = curPos.charAt(0)
            const y = curPos.charAt(1)
            const xInd = cols.indexOf(x)
            const yInd = rows.indexOf(y)
            let pMoves=[]
            let pMoves2=[]
 
            //if the square +1,+2 is not blocked, it is available to move
            if(!board.squares[cols[xInd]+rows[yInd+1]]){
                pMoves.push(cols[xInd]+rows[yInd+1])
            }
            if(!board.squares[cols[xInd]+rows[yInd+2]]&&y==2){
                pMoves.push(cols[xInd]+rows[yInd+2])}

            //If there is a piece in front, the move is null

            //If there is a black piece to capture L, it gets added
            if(board.squares[cols[xInd+1]+rows[yInd+1]]){
                if(board.squares[cols[xInd+1]+rows[yInd+1]].color=="black"){
                pMoves.push(
                    cols[xInd+1]+rows[yInd+1], 
                )
                }
            }
            //If there is a black piece to capture R, it gets added
            if(board.squares[cols[xInd-1]+rows[yInd+1]]){
                if(board.squares[cols[xInd-1]+rows[yInd+1]].color=="black"){
                    pMoves.push(
                        cols[xInd-1]+rows[yInd+1]
                    )
                }
               
            }
             //en passant:
             if(moveRecord[moveRecord.length-1]){
                if(
                    moveRecord[moveRecord.length-1][0].charAt(1)=="7"&&
                    moveRecord[moveRecord.length-1][1].charAt(1)=="5"&&
                    moveRecord[moveRecord.length-1][1].charAt(0)==cols[xInd+1]|
                    moveRecord[moveRecord.length-1][1].charAt(0)==cols[xInd-1]&&
                    y==5&&
                    board.squares[moveRecord[moveRecord.length-1][1]].name=="pawn"
                    
                    ){
                   pMoves.push(
                       moveRecord[moveRecord.length-1][1].charAt(0)+"6"
                       )
                }
            }
            
            pMoves.forEach(move=>{
                if(move.length==2){
                    pMoves2.push(move)
                }
            }) 
            if(!gameStates.wToMove) pMoves2=[]
            return pMoves2
        },
        attackSqrs(curPos){
            const x = curPos.charAt(0)
            const y = curPos.charAt(1)
            const xInd = cols.indexOf(x)
            const yInd = rows.indexOf(y)
            let pMoves=[]
            let pMoves2=[]
            pMoves.push(
                cols[xInd+1]+rows[yInd+1],
                cols[xInd-1]+rows[yInd+1]
            )
            pMoves.forEach(move=>{
                if(move.length==2){
                    pMoves2.push(move)
                }
            }) 
            return pMoves2
        }
    },
    points:0,
    captured:[]
}
//the black piece types, points, and captured data
const black = {
    R:{
        color:'black',
        name:'rook',
        value:50,
        icon:`<i class="fas b fa-chess-rook"></i>`,
        moves(curPos,isAttack){
            const x = curPos.charAt(0)
            const y = curPos.charAt(1)
            const xInd = cols.indexOf(x)
            const yInd = rows.indexOf(y)
            let rMoves = []
            //right
            for(let i = xInd+1;i<cols.length;i++){
                if(board.squares[cols[i]+y].color){
                    //If this is run with "attack squares" being true, black pieces show up before being blocked
                    if(board.squares[cols[i]+y].color==this.color&&!isAttack){
                        break
                        
                    }else{
                        rMoves.push(cols[i]+y)
                        break
                    }
                }else
                rMoves.push(cols[i]+y)
            }
            //right
            for(let i = xInd-1;i>=0;i--){
                if(board.squares[cols[i]+y].color){
                    if(board.squares[cols[i]+y].color==this.color&&!isAttack){
                        break
                    }else{
                        rMoves.push(cols[i]+y)
                        break
                    }
                }else
                rMoves.push(cols[i]+y)
            }
            //up
            for(let i = yInd+1;i<rows.length;i++){
                if(board.squares[x+rows[i]].color){
                    if(board.squares[x+rows[i]].color==this.color&&!isAttack){
                        break
                        
                    }else{
                        rMoves.push(x+rows[i])
                        break
                    }
                }else
                rMoves.push(x+rows[i])
            }
             //down
             for(let i = yInd-1;i>=0;i--){
                if(board.squares[x+rows[i]].color){
                    if(board.squares[x+rows[i]].color==this.color&&!isAttack){
                        break
                        
                    }else{
                        rMoves.push(x+rows[i])
                        break
                    }
                }else
                rMoves.push(x+rows[i])
            }
            if(gameStates.wToMove&&!isAttack) rMoves=[]
            return rMoves
        },
        attackSqrs(curPos){
            return this.moves(curPos,true)
        },
        
    },
    N:{
        color:'black',
        name:'knight',
        value:30,
        icon:`<i class="fas b fa-chess-knight"></i>`,
        moves(curPos,isAttack){
            const x = curPos.charAt(0)
            const y = curPos.charAt(1)
            const xInd = cols.indexOf(x)
            const yInd = rows.indexOf(y)
            let nMoves =[]
            let nMoves2 = []
                nMoves.push(
                    cols[xInd-1]+rows[yInd-2],
                    cols[xInd+1]+rows[yInd-2],
                    cols[xInd-2]+rows[yInd+1],
                    cols[xInd-2]+rows[yInd-1],
                    cols[xInd-1]+rows[yInd+2],
                    cols[xInd+1]+rows[yInd+2],
                    cols[xInd+2]+rows[yInd+1],
                    cols[xInd+2]+rows[yInd-1]
                )
                //makes new array without "undefined" squares
                nMoves.forEach(move=>{
                    if(move.length==2){
                        nMoves2.push(move)
                    }
                }) 
                nMoves=[]
            
                nMoves2.forEach(move=>{
                    //if the square is occupied
                    if(board.squares[move]){
                        //if the square is the same color
                        if(board.squares[move].color==this.color&&isAttack){
                            nMoves.push(move)
                        } else if(board.squares[move].color==this.color&&!isAttack){
                    //if the square is the enemy color       
                        } else{
                            nMoves.push(move)
                        }
                    }else{
                        nMoves.push(move)
                    }
                })
            if(gameStates.wToMove&&!isAttack) nMoves=[]
            return nMoves
        },
        attackSqrs(curPos){
            return this.moves(curPos,true)
        },
    },
    B:{
        color:'black',
        name:'bishop',
        value:30,
        icon:`<i class="fas b fa-chess-bishop"></i>`,
        moves(curPos,isAttack){
            const x = curPos.charAt(0)
            const y = curPos.charAt(1)
            const xInd = cols.indexOf(x)
            const yInd = rows.indexOf(y)
            let bMoves = []
            let bMoves2 =[]

                //left-up
                   for(let i = xInd+1;i<cols.length;i++){
                       let j = i-xInd
                       let Sqr = cols[i]+rows[yInd+j]
                       //if a square is blocking
                       if(board.squares[Sqr]){
                            //if same color
                            if(board.squares[Sqr].color==this.color&&isAttack){
                                bMoves.push(Sqr)
                                break
                            }else if(board.squares[Sqr].color==this.color){
                                break
                            }else{
                                bMoves.push(Sqr)
                                break
                            }

                       }else bMoves.push(Sqr)
                }
                //right-up
                for(let i = xInd-1;i>=0;i--){
                      let j = i-xInd
                      let Sqr = cols[i]+rows[yInd-j]
                     //if a square is blocking
                     if(board.squares[Sqr]){
                        //if same color
                        if(board.squares[Sqr].color==this.color&&isAttack){
                            bMoves.push(Sqr)
                            break
                        }else if(board.squares[Sqr].color==this.color){
                            break
                        }else{
                            bMoves.push(Sqr)
                            break
                        }

                   }else bMoves.push(Sqr)
                }
                 //left-down
                 for(let i = yInd-1;i>=0;i--){
                     let j = i-yInd
                     let Sqr = cols[xInd+j]+rows[i]
                    //if a square is blocking
                    if(board.squares[Sqr]){
                        //if same color
                        if(board.squares[Sqr].color==this.color&&isAttack){
                            bMoves.push(Sqr)
                            break
                        }else if(board.squares[Sqr].color==this.color){
                            break
                        }else{
                            bMoves.push(Sqr)
                            break
                        }

                   }else bMoves.push(Sqr)
                }
                for(let i = yInd-1;i>=0;i--){
                    let j = i-yInd
                    let Sqr = cols[xInd-j]+rows[i]
                 //if a square is blocking
                 if(board.squares[Sqr]){
                    //if same color
                    if(board.squares[Sqr].color==this.color&&isAttack){
                        bMoves.push(Sqr)
                        break
                    }else if(board.squares[Sqr].color==this.color){
                        break
                    }else{
                        bMoves.push(Sqr)
                        break
                    }

               }else bMoves.push(Sqr)
               }
               bMoves.forEach(move=>{
                if(move.length==2){
                    bMoves2.push(move)
                }
                }) 
                
            if(gameStates.wToMove&&!isAttack) bMoves2=[]
            return bMoves2
        },
        attackSqrs(curPos){
            return this.moves(curPos,true)
        },
    },
    Q:{
        color:'black',
        name:'queen',
        value:90,
        icon:`<i class="fas b fa-chess-queen"></i>`,
        moves(curPos,isAttack){
            let diagMoves=black.R.moves(curPos,isAttack)
            let horzMoves=black.B.moves(curPos,isAttack)
            let allMoves= diagMoves.concat(horzMoves)
            if(gameStates.wToMove&&!isAttack) allMoves=[]
            return allMoves.flat(2)
        },
        attackSqrs(curPos){
            return this.moves(curPos,true)
        },
    },
    K:{
        color:'black',
        name:'king',
        value:1000,
        icon:`<i class="fas b fa-chess-king"></i>`,
        moves(curPos,isAttack){
            const x = curPos.charAt(0)
            const y = curPos.charAt(1)
            const xInd = cols.indexOf(x)
            const yInd = rows.indexOf(y)
            let kMoves=[]
            let kMoves2=[]
            if(!gameStates.A8RookMoved&&!gameStates.bKingMoved){
                kMoves.push("C8")
            }
            if(!gameStates.H8RookMoved&&!gameStates.bKingMoved){
                kMoves.push("G8")
            }
            kMoves.push(
                cols[xInd+1]+rows[yInd-1],
                cols[xInd+1]+rows[yInd+1],
                cols[xInd+1]+rows[yInd],
                cols[xInd-1]+rows[yInd-1],
                cols[xInd-1]+rows[yInd+1],
                cols[xInd-1]+rows[yInd],
                cols[xInd]+rows[yInd+1],
                cols[xInd]+rows[yInd-1]
            )
            kMoves.forEach(move=>{
                if(move.length==2){
                    kMoves2.push(move)
                }
            })
            kMoves=[]
            kMoves2.forEach(move=>{
                //if the square is occupied
                if(board.squares[move]){
                    //if the square is the same color
                    if(board.squares[move].color==this.color&&isAttack){
                        kMoves.push(move)
                    } else if(board.squares[move].color==this.color&&!isAttack){
                //if the square is the enemy color       
                    } else{
                        kMoves.push(move)
                    }
                }else{
                    kMoves.push(move)
                }
            })
            if(gameStates.wToMove&&!isAttack) kMoves=[]
            return kMoves
        },
        attackSqrs(curPos){
            return this.moves(curPos,true)
        },
        
    },
    P:{
        color:'black',
        name:'pawn',
        value:10,
        icon:`<i class="fas b fa-chess-pawn"></i>`,
        moves(curPos){
            const x = curPos.charAt(0)
            const y = curPos.charAt(1)
            const xInd = cols.indexOf(x)
            const yInd = rows.indexOf(y)
            let pMoves=[]
            let pMoves2=[]
 
            //if the square +1,+2 is not blocked, it is available to move
            if(!board.squares[cols[xInd]+rows[yInd-1]]){
                pMoves.push(cols[xInd]+rows[yInd-1])
            }
            if(!board.squares[cols[xInd]+rows[yInd-2]]&&y==7){
                pMoves.push(cols[xInd]+rows[yInd-2])}


            //If there is a black/white piece to capture L, it gets added
            if(board.squares[cols[xInd+1]+rows[yInd-1]]){
                if(board.squares[cols[xInd+1]+rows[yInd-1]].color=="white"){
                pMoves.push(
                    cols[xInd+1]+rows[yInd-1], 
                )
                }
            }
            //If there is a black/white piece to capture R, it gets added
            if(board.squares[cols[xInd-1]+rows[yInd-1]]){
                if(board.squares[cols[xInd-1]+rows[yInd-1]].color=="white"){
                    pMoves.push(
                        cols[xInd-1]+rows[yInd-1]
                    )
                }
               
            }
              //en passant:
              if(moveRecord[moveRecord.length-1]){
                if(
                    moveRecord[moveRecord.length-1][0].charAt(1)=="2"&&
                    moveRecord[moveRecord.length-1][1].charAt(1)=="4"&&
                    moveRecord[moveRecord.length-1][1].charAt(0)==cols[xInd+1]|
                    moveRecord[moveRecord.length-1][1].charAt(0)==cols[xInd-1]&&
                    y==4&&
                    board.squares[moveRecord[moveRecord.length-1][1]].name=="pawn"
                    
                    ){
                   pMoves.push(
                       moveRecord[moveRecord.length-1][1].charAt(0)+"3"
                       )
                }
            }
            
            pMoves.forEach(move=>{
                if(move.length==2){
                    pMoves2.push(move)
                }
            }) 
            if(gameStates.wToMove) pMoves2=[]
            return pMoves2
        },
        attackSqrs(curPos){
            const x = curPos.charAt(0)
            const y = curPos.charAt(1)
            const xInd = cols.indexOf(x)
            const yInd = rows.indexOf(y)
            let pMoves=[]
            let pMoves2=[]
            pMoves.push(
                cols[xInd+1]+rows[yInd-1],
                cols[xInd-1]+rows[yInd-1]
            )
            pMoves.forEach(move=>{
                if(move.length==2){
                    pMoves2.push(move)
                }
            }) 
            this.color="black"
            return pMoves2
        }
    },
    captured:[]
}

//moves
function move(Old,New,calc){//like "E4", "C7", etc
    let s = board.squares
    //START WITH ADDING THE NON-CHANGING MOVE TYPES/////////
    //Pawn promotion. 
    if(gameStates.wIsQueening){
      return queenPawnW(Old,s)
    }else if(gameStates.bIsQueening){
        console.log("black is queening!")
        return queenPawnB(Old,s)
    }
    //An invalid move sequence is typed
    if(!New){
        return "You must have two legal moves!"
    }
    //if the square is empty
    if(!s[Old]){
        return "Square is empty!"
    }
    let moves = findLegalMoves() 
    //if the move isn't legal
    if(!moves.includes(Old+New)){
        return "Move isn't legal!"
    } 
    //NOW THE BOARD CHANGES/////////////////////////////
    gameStates.sincePawnOrCapture++
    //if move is a castle, make rook jump
    jumpRook(Old,New)

    //if piece is captured, add points to opposing player
    if(s[New].color=="white"&&s[Old].color=="black"){
        white.points-=s[New].value
        white.captured=s[New].name
        gameStates.sincePawnOrCapture=0
    }else if(s[New].color=="black"&&s[Old].color=="white"){
        white.points+=s[New].value
        black.captured=s[New].name
        gameStates.sincePawnOrCapture=0
    }

    //if move is a white pawn promotion
    if(
        New.charAt(1)==8&&
        Old.charAt(1)==7&&
        s[Old].name=="pawn"
    ){
        gameStates.wIsQueening=New
        gameStates.wQueenFrom=Old
        s[New] = s[Old]
        s[Old]=""
        console.log("promotion:",gameStates.wIsQueening)
        return (s[New].name+New+": Promotion! (W) Type R,Q,N, etc")
    }
    //if move is a black pawn promotion
    if(
        New.charAt(1)==1&&
        Old.charAt(1)==2&&
        s[Old].name=="pawn"
    ){
        gameStates.bIsQueening=New
        gameStates.bQueenFrom=Old
        s[New] = s[Old]
        s[Old]=""
        return (s[New].name+New+": Promotion! (B) Type R,Q,N, etc")
    }
    //adds new, deletes old, updates conditions
        if(s[Old].name=="pawn") gameStates.sincePawnOrCapture=0

         //EN PASSANT
         if(
            s[Old].name=="pawn"&&
            Old.charAt(0)!=New.charAt(0)&&
            s[New]==""
        ){  
            console.log('en passant capture!')
            if(gameStates.wToMove){
                s[New.charAt(0)+(New.charAt(1)-1)]=""
            }else{
                s[New.charAt(0)+(New.charAt(1)+1)]=""
            }
        }
        s[New] = s[Old]
        s[Old]=""
        positions.push(JSON.stringify(board.squares))
        gameStates.wToMove=!gameStates.wToMove

        endGameConditions(calc)
        legalMoves = findLegalMoves()
        moveRecord.push([Old,New])
        return (s[New].name+New)
    
}


//queens a white pawn
function queenPawnB(Old,s){
    if(
        Old!="N"&&
        Old!="R"&&
        Old!="Q"&&
        Old!="B"
    ){
        return "Invalid piece type!"
    }
    s[gameStates.bIsQueening]=black[Old]
    gameStates.wToMove=!gameStates.wToMove
    let message = gameStates.bQueenFrom+"-"+gameStates.bIsQueening+"="+Old
    gameStates.bQueenFrom=""
    gameStates.bIsQueening=""
    return message
}
//queens a black pawn
function queenPawnW(Old,s){
    if(
        Old!="N"&&
        Old!="R"&&
        Old!="Q"&&
        Old!="B"
    ){
        return "Invalid piece type!"
    }
    s[gameStates.wIsQueening]=white[Old]
    gameStates.wToMove=!gameStates.wToMove
    let message = gameStates.wQueenFrom+"-"+gameStates.wIsQueening+"="+Old
    gameStates.wQueenFrom=""
    gameStates.wIsQueening=""
    return message
}
//sets all pieces to starting position
function startPosition(){
    let s = board.squares
        s.A1=white.R
        s.B1=white.N
        s.C1=white.B
        s.D1=white.Q
        s.E1=white.K
        s.F1=white.B
        s.G1=white.N
        s.H1=white.R
        s.A2=white.P
        s.B2=white.P
        s.C2=white.P
        s.D2=white.P
        s.E2=white.P
        s.F2=white.P
        s.G2=white.P
        s.H2=white.P
        s.A8=black.R
        s.B8=black.N
        s.C8=black.B
        s.D8=black.Q
        s.E8=black.K
        s.F8=black.B
        s.G8=black.N
        s.H8=black.R
        s.A7=black.P
        s.B7=black.P
        s.C7=black.P
        s.D7=black.P
        s.E7=black.P
        s.F7=black.P
        s.G7=black.P
        s.H7=black.P

    positions.push(JSON.stringify(board.squares))
    return board.squares
}
//removes all pieces from board
function clearPosition(){
    gameStates = JSON.parse(initialState)
    board.squares=gameStates.startingSquares
    positions=[]
    duplicatedPositions=[]
    return board.squares
}
//finds the places where a piece can attack (not necessarily legal)
function findAttackSquares(piecesToo,cancelWhite,cancelBlack){
    let attackSquares={
        white:[],
        black:[],
        wAttacked:[],
        bAttacked:[],
    }
    for(let square in board.squares){
        let sqr = board.squares[square]
        if(sqr.color == white.P.color){
            let wsqrs = sqr.attackSqrs(square)
            attackSquares.white.push(wsqrs)
        }else if(sqr.color==black.P.color){
            let bsqrs = sqr.attackSqrs(square)
            attackSquares.black.push(bsqrs)
        }
    }
attackSquares.white = attackSquares.white.flat()
attackSquares.black = attackSquares.black.flat()

if(piecesToo){
    for(let sqr of attackSquares.white){
        if(board.squares[sqr]&&board.squares[sqr].color=="black"){
            if(attackSquares.bAttacked[attackSquares.bAttacked.length-1]!=sqr){
                attackSquares.bAttacked.push(sqr)
            }
            
        }
    }
    for(let sqr of attackSquares.black){
        if(board.squares[sqr]&&board.squares[sqr].color=="white"){
            if(attackSquares.wAttacked[attackSquares.wAttacked.length-1]!=sqr){
                attackSquares.wAttacked.push(sqr)
            }
        }
    }
}


return attackSquares
}
//finds the legal moves in a given position
function findLegalMoves(){
    let legMoves=[]
    let wPieceSqrs=[]
    let bPieceSqrs=[]
    let s = board.squares

    //if conditions for castling are false, it permanently turns them off
    invalidateCastles()

    //ADDS CASTLING
    if(gameStates.wToMove){
        let qCastle = wQueenSideCastle()
        let kCastle = wKingSideCastle()
        if(qCastle){
            legMoves.push(qCastle)
        }
        if(kCastle){
            legMoves.push(kCastle)
        }
    }else{
        let qCastle = bQueenSideCastle()
        let kCastle = bKingSideCastle()
        if(qCastle){
            legMoves.push(qCastle)
        }
        if(kCastle){
            legMoves.push(kCastle)
        }
    }
 
    //keeps an array of the current white/black pieces
    for(let square in board.squares){
        //square: "E4", "C5" etc
        if(gameStates.wToMove){
            if(s[square].color=="white"){
                wPieceSqrs.push(square)
            }
        }else{
            if(s[square].color=="black"){
                bPieceSqrs.push(square)
            }
        }
    }
    //makes a move, checks for check, returns (white)
    wPieceSqrs.forEach(wSqr=>{
        let piece = board.squares[wSqr]
        let wMoves = piece.moves(wSqr)
        if(wMoves.length>0){
            wMoves.forEach(wMove=>{
                let occupant=board.squares[wMove]
                board.squares[wSqr]=""
                board.squares[wMove]=piece
                if(!findCheck()) legMoves.push(wSqr+wMove)
                board.squares[wSqr]=piece
                board.squares[wMove]=occupant
            })
        }
    })
    //makes a move, checks for check, returns (black)
    bPieceSqrs.forEach(bSqr=>{
        let piece = board.squares[bSqr]
        let bMoves = piece.moves(bSqr)
        if(bMoves.length>0){
            bMoves.forEach(bMove=>{
                let occupant=board.squares[bMove]
                board.squares[bSqr]=""
                board.squares[bMove]=piece
                if(!findCheck()) legMoves.push(bSqr+bMove)
                board.squares[bSqr]=piece
                board.squares[bMove]=occupant
            })
        }
    })


    //legMoves returns an array populated with 2-length arrays with the 
    //starting,ending moves (i.e., ["E4","E5"])
    return legMoves

}
//checks for checkmate
function findCheckMate(){
    if(!findCheck()) return false

    if(findLegalMoves().length==0) return true

    else return false
}
//checks for check
function findCheck(){
//start with the white king. You should check if white is to move, then if it is in the path of any black atk squares.
        let check=false
        let atkSquares = findAttackSquares()
        

        if(gameStates.wToMove==true){
            atkSquares.black.forEach(sqr=>{
                if(board.squares[sqr].name=="king"&&board.squares[sqr].color=="white"){
                    check=true
                }
            })
        }else{
            atkSquares.white.forEach(sqr=>{
                if(board.squares[sqr].name=="king"&&board.squares[sqr].color=="black"){
                    check=true
                }
            })
        }
        return check
}
//finds stalemate
function findStaleMate(){
    let legMoves = findLegalMoves()
    if(legMoves.length==0&&!findCheck()){
        return true
    }
    else return false
}
//checks if white king can castle kingside
function wKingSideCastle(){
      if(
        !gameStates.wKingMoved&&
        !gameStates.H1RookMoved&&
        !findCheck()&&
        !findAttackSquares().black.includes("F1")&&
        !findAttackSquares().black.includes("G1")&&
        board.squares.F1==""&&
        board.squares.G1==""
    ){
        return "E1G1"
    } else return undefined
}
//checks if white king can castle queenside
function wQueenSideCastle(){
    if(
      !gameStates.wKingMoved&&
      !gameStates.A1RookMoved&&
      !findCheck()&&
      !findAttackSquares().black.includes("D1")&&
      !findAttackSquares().black.includes("C1")&&
      board.squares.D1==""&&
      board.squares.C1==""&&
      board.squares.B1==""
  ){
      return "E1C1"
  } else return undefined
}
//checks if black king can castle kingside
function bKingSideCastle(){
    if(
      !gameStates.bKingMoved&&
      !gameStates.H8RookMoved&&
      !findCheck()&&
      !findAttackSquares().white.includes("F8")&&
      !findAttackSquares().white.includes("G8")&&
      board.squares.F8==""&&
      board.squares.G8==""
  ){
      return "E8G8"
  } else return undefined
}
//checks if black king can castle queenside
function bQueenSideCastle(){
  if(
    !gameStates.bKingMoved&&
    !gameStates.A8RookMoved&&
    !findCheck()&&
    !findAttackSquares().white.includes("D8")&&
    !findAttackSquares().white.includes("C8")&&
    board.squares.D8==""&&
    board.squares.C8==""&&
    board.squares.B8==""
){
    return "E8C8"
} else return undefined
}
//moves rook if the king castles
function jumpRook(Old,New){
    let s=board.squares
    //KINGSIDE-W
    if(
    Old=="E1"&&
    New=="G1"&&
    s[Old].name=="king"
    ){
    s.H1=""
    s.F1=white.R
    }
    //QUEENSIDE-W
    if(
    Old=="E1"&&
    New=="C1"&&
    s[Old].name=="king"
    ){
    s.A1=""
    s.D1=white.R
    }
    //KINGSIDE-B
    if(
    Old=="E8"&&
    New=="G8"&&
    s[Old].name=="king"
    ){
    s.H8=""
    s.F8=black.R
    }
    //QUEENSIDE-B
    if(
    Old=="E8"&&
    New=="C8"&&
    s[Old].name=="king"
    ){
    s.A8=""
    s.D8=black.R
    }

}



//changes game states to prevent castling
function invalidateCastles(){
    if(board.squares.A1!=white.R){
        gameStates.A1RookMoved=true
    }
    if(board.squares.H1!=white.R){
        gameStates.H1RookMoved=true
    }
    if(board.squares.A8!=black.R){
        gameStates.A8RookMoved=true
    }
    if(board.squares.H8!=black.R){
        gameStates.H8RookMove1d=true
    }
    if(board.squares.E1!=white.K){
        gameStates.wKingMoved=true
    }
    if(board.squares.E8!=black.K){
        gameStates.bKingMoved=true
    }
}
//finds a draw by repetition
function findRepetition(){
        if(duplicatedPositions.includes(positions[positions.length-1])){
            return true
        }
        let prevPos = positions.slice(0,positions.length-1)
        if(prevPos.includes(positions[positions.length-1])){
            duplicatedPositions.push(positions[positions.length-1])
        } 
        return false
}
//ends the game if conditions are met
function endGameConditions(calc){
    //determines GAME ENDING conditions
        let drawByRep = findRepetition()
        let stale = findStaleMate()
        let mate = findCheckMate()

        if(gameStates.wToMove&&mate){
            black.points=100
            white.points=0
            return true
        }else if(!gameStates.wToMove&&mate){
            black.points=0
            white.points=100
            return true
        }else if(stale){
            black.points=0
            white.points=0
            return true
        }else if(gameStates.sincePawnOrCapture==50){
            black.points=0
            white.points=0
            return true
        }else if(drawByRep){
            black.points=0
            white.points=0
            return true
        }
        return false
}
function makeOneMove(){
    let legMoves = findLegalMoves() //an array containing two-value arrays
    move(legMoves[0][0],legMoves[0][1]) //dummy function that makes the computer make the first legal move, no matter what it is
    return legMoves[0]
}
function getRandomNum(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
function highestKey(obj){
    return Object.keys(obj).reduce((a, b)=>obj[a] > obj[b] ? a : b )
  }
function lowestKey(obj){
    return Object.keys(obj).reduce((a, b)=>obj[a] < obj[b] ? a : b )
}
function calcMovesGood(computerWhite){
    let loop=1
    let endValues={}

    function calcMovesLoop(valInput,recursion){
    let breakLoop = false

    for(let m of makeLegalMovesArr(findLegalMoves())){
        //move
        if(!breakLoop){let occupant=board.squares[m[1]]
        let piece = board.squares[m[0]]
        let New = m[1]
        let Old = m[0]
        let val = valInput
        board.squares[New]=piece
        board.squares[Old]=""
        if(occupant.color=="white") val-=occupant.value
        if(occupant.color=="black") val+=occupant.value
        gameStates.wToMove=!gameStates.wToMove;
        if(findCheckMate()) {
            computerWhite ? val = (100) : val = (-100)
            endValues[m]=val
            breakLoop=true
        }else{
            endValues[m]=val
        }
        //Between Here
        if(!breakLoop){
        (function(){
            let noMate=true
            for(let M of makeLegalMovesArr(findLegalMoves())){
                if(noMate)
               { //move
                let occupant=board.squares[M[1]]
                let piece = board.squares[M[0]]
                let New = M[1]
                let Old = M[0]
                let Val = val

                board.squares[New]=piece
                board.squares[Old]=""

                if(occupant.color=="white") Val-=occupant.value
                if(occupant.color=="black") Val+=occupant.value

                gameStates.wToMove=!gameStates.wToMove;
                
                if(computerWhite==true){
                    if(endValues[m]>Val) endValues[m]=Val
                } else if(computerWhite==false){
                    if(endValues[m]<Val) endValues[m]=Val
                }

                if(findCheckMate()){
                    computerWhite ? Val = (-100) : Val = (100)
                    endValues[m] = Val
                    noMate = false
                } 
                // Between Here
             
                // Is where to loop
                board.squares[New]=occupant
                board.squares[Old]=piece

                gameStates.wToMove=!gameStates.wToMove}
            }
        })()
        }
        //Outer function
            board.squares[New]=occupant
            board.squares[Old]=piece
            gameStates.wToMove=!gameStates.wToMove}
        }
    }
    calcMovesLoop(0,true)

    let selectedMove=""
    if(computerWhite){
        let hKey = highestKey(endValues)
        let keys = Object.keys(endValues)
        if(keys.length>1){
            for(let key of keys){
                if(endValues[key]<endValues[hKey]) delete endValues[key]
            }
            keys = Object.keys(endValues)
            if(keys.length>1){
                selectedMove = keys[getRandomNum(keys.length-1)]
            }else{
                selectedMove = keys[0]
            }
        }else selectedMove = hKey
        
        return selectedMove.split(",")
        //END
    }else{
        let lKey = lowestKey(endValues)
        let keys = Object.keys(endValues)

        if(keys.length>1){
            for(let key of keys){
                if(endValues[key]>endValues[lKey]) delete endValues[key]
            }
            keys = Object.keys(endValues)

            if(keys.length>1){
                selectedMove = keys[getRandomNum(keys.length-1)]
            }else{
                selectedMove = keys[0]
            }
        }else selectedMove = lKey
 
        return selectedMove.split(",")
        //END
    }
    
}

function findTotalAttackers(sqr){ //like "E4","C7". Only works if square is occupied.
    if(!board.squares[sqr]) return null

    let currentMove = gameStates.wToMove
    let occupants={
        attackers:{},
        defenders:{},
    } 
    let sortAttacks=[]
    let sortDefends=[]
    let value = 0
    occupants[sqr] = board.squares[sqr]

    function recursiveAttackers(){
        let legMoves = makeLegalMovesArr(findLegalMoves())
        let found = false
        for(let m of legMoves){
            if(m[1]==sqr){
                found = true
                
                //makes a weird array containing strings with the value and square. ["90E4","30F7"]
                if(currentMove == gameStates.wToMove) {
                    occupants.attackers[m[0]]=board.squares[m[0]] 
                    sortAttacks.push(board.squares[m[0]].value+m[0])
                }
                else {
                    occupants.defenders[m[0]]=board.squares[m[0]]
                    sortDefends.push(board.squares[m[0]].value+m[0])
                }

            }
        }

        if(!found) {
            gameStates.wToMove=currentMove
            for(let o in occupants.attackers){
                board.squares[o]=occupants.attackers[o]
            }
            for(let o in occupants.defenders){
                board.squares[o]=occupants.defenders[o]
            }
            board.squares[sqr] = occupants[sqr]
            return 
        }
        
        if(gameStates.wToMove==currentMove){
             //array with values of attackers ranked from lowest to highest
                sortAttacks = sortAttacks
                .sort((a,b)=>a-b)    
                .map(a=>a.slice(-2))
            //capture with the lowest value piece, adds the value, removes the old square
                board.squares[sqr].color=="black" ? value+=board.squares[sqr].value : value-=board.squares[sqr].value
                board.squares[sqr]=occupants.attackers[sortAttacks[0]]
                board.squares[sortAttacks[0]]=""
                sortAttacks=[]
        } else{
            //array with values of defenders ranked from lowest to highest
                sortDefends = sortDefends
                .sort((a,b)=>a-b)    
                .map(a=>a.slice(-2))
            //capture with the lowest value piece, adds the value, removes the old square
                board.squares[sqr].color=="black" ? value+=board.squares[sqr].value : value-=board.squares[sqr].value
                board.squares[sqr]=occupants.defenders[sortDefends[0]]
                board.squares[sortDefends[0]]=""
                sortDefends=[]
        }
        gameStates.wToMove=!gameStates.wToMove
        recursiveAttackers()
    }
    recursiveAttackers()
    
    return value
    //now, let's break down how it distributes points

}
function findUndefended(obj){
    const undefended = {
        white:[],
        black:[]
    }
    const attackSquares = {...obj}
        for(let atk of attackSquares.black){
            if(board.squares[atk]&&board.squares[atk].color=="white"&&!attackSquares.white.includes(atk)){
                undefended.white.push(atk)
            }
        }
        for(let atk of attackSquares.white){
            if(board.squares[atk]&&board.squares[atk].color=="black"&&!attackSquares.black.includes(atk)){
                undefended.black.push(atk)
            }
        }
    return undefended
}

//Ok. add capture sequence.

function calcMoves(computerWhite){
    let loop=1
    let endValues={}


    function calcMovesLoop(valInput,recursion){
    let breakLoop = false

    const currentAttacks = findAttackSquares(true)
    console.log("CurrentAttacks:",currentAttacks)


    for(let m of makeLegalMovesArr(findLegalMoves())){
        //move
        if(!breakLoop){
        
        let occupant=board.squares[m[1]]
        let piece = board.squares[m[0]]
        let New = m[1]
        let Old = m[0]
        let val = valInput
        board.squares[New]=piece
        board.squares[Old]=""

        //BASIC PRINCIPLES THAT FAVOR BLACK
        if(!gameStates.wToMove){
            //favors moves that increase number of attacked squares
            let newAttacks = findAttackSquares(true)

            const undefended = findUndefended(newAttacks)

            if(newAttacks.black.length>currentAttacks.black.length){
                val--
            }
            else if(newAttacks.wAttacked.length>currentAttacks.wAttacked.length&&positions.length>2){
                val-=(newAttacks.wAttacked.length-currentAttacks.wAttacked.length)
            }

            if(newAttacks.bAttacked.length>currentAttacks.bAttacked.length){
                val++
            }

                if(undefended.black.length>0&&positions.length>4){ 
                    val+=undefended.black.length
                }
                if(undefended.white.length>0&&positions.length>4) {
                    val-=undefended.white.length
                    
                }
                
                

            //bad openings?
            if(positions.length<8){
                if(piece.name=="queen"){
                    val++
                }
                if(piece.name=="pawn"&&New.charAt(0)=="A"){
                    val++
                }
                if(piece.name=="pawn"&&New.charAt(0)=="H"){
                    val++
                }
            }
            if(piece.name=="knight"&&New.charAt(0)=="A"){
                val++
            }
            if(piece.name=="knight"&&New.charAt(0)=="H"){
                val++
            }
          

        }else{

        }

    
        //check for queening:
        if(piece.name=="pawn"){
            if(New.charAt(1)==1){
                val-=90
                console.log("PROMOTION")
            }
            if(Old.charAt(1)==8){
                val+=90
                console.log("PROMOTION")
            }
        }

        if(occupant.color=="white") val-=occupant.value
        if(occupant.color=="black") val+=occupant.value

        gameStates.wToMove=!gameStates.wToMove;
        //if checkmate, the value is instantly determined
        if(findCheckMate()) {
            computerWhite ? val = (1000) : val = (-1000)
            endValues[m]=val
            breakLoop=true
        }else{
        //if not, its complicated.........
            // if(piece.color=="black"){
            //     if(fullAtkSqrs.wAttackers.hasOwnProperty(New)){
            //         endValues[m]=findTotalAttackers(New)
            //     }
            //     else endValues[m]=val
            // }
            endValues[m]=val
        }

        //Now black's turn to respond
        if(!breakLoop){
        (function(){
            let noMate=true

            

            for(let M of makeLegalMovesArr(findLegalMoves())){

                if(noMate)
               { //move
                let occupant=board.squares[M[1]]
                let piece = board.squares[M[0]]
                let New = M[1]
                let Old = M[0]
                let Val = val

                const newAttacks = findAttackSquares()
                const undefended = findUndefended(newAttacks)

                if(undefended.black.length>0&&positions.length>4){ 
                    val+=(undefended.black.length*3)
                }
                if(undefended.white.length>0&&positions.length>4) {
                    val-=(undefended.white.length*3)
                    
                }


            
                
                // if(occupant.color=="white") Val-=occupant.value
                // if(occupant.color=="black") Val+=occupant.value

                if(occupant){
                    Val+=findTotalAttackers(New)
                }

                board.squares[New]=piece
                board.squares[Old]=""

                gameStates.wToMove=!gameStates.wToMove;
                
                if(computerWhite){
                    if(endValues[m]>Val) endValues[m]=Val
                } else {
                    if(Val>endValues[m]) endValues[m]=Val
                }

                if(findCheckMate()){
                    computerWhite ? Val = (-1000) : Val = (1000)
                    endValues[m] = Val
                    noMate = false
                } 
                // Between Here
             
                // Is where to loop
                board.squares[New]=occupant
                board.squares[Old]=piece

                gameStates.wToMove=!gameStates.wToMove}
            }
        })()
        }
        //Outer function
            board.squares[New]=occupant
            board.squares[Old]=piece
            gameStates.wToMove=!gameStates.wToMove}
        }
    }
    calcMovesLoop(0,true)
    console.log("endValues:",endValues)
    let selectedMove=""
    if(computerWhite){
        let hKey = highestKey(endValues)
        let keys = Object.keys(endValues)
        if(keys.length>1){
            for(let key of keys){
                if(endValues[key]<endValues[hKey]) delete endValues[key]
            }
            keys = Object.keys(endValues)
            if(keys.length>1){
                selectedMove = keys[getRandomNum(keys.length-1)]
            }else{
                selectedMove = keys[0]
            }
        }else selectedMove = hKey
        
        return selectedMove.split(",")
    }else{//THIS ONE. THE COMPUTER PLAYS AS BLACK.
        let lKey = lowestKey(endValues)
        let keys = Object.keys(endValues)
        console.log("Lowest Key:",lKey)

        if(keys.length>1){
            for(let key of keys){
                if(endValues[key]>endValues[lKey]) delete endValues[key]
            }
            keys = Object.keys(endValues)
            if(keys.length>1){
                selectedMove = keys[getRandomNum(keys.length)]
            }else{
                selectedMove = keys[0]
            }
        }else selectedMove = lKey
 
        return selectedMove.split(",") //ARRAY WITH ["E2","E4"]
        //END
    }
    
}



//what is the best possible result you can get without searching every possible move? Can you make it semi decent?

startPosition()

legalMoves = findLegalMoves()

function makeLegalMovesArr(legalMoves){
    let arr=[]
    legalMoves.forEach(m=>{
        let Old = m.charAt(0)+m.charAt(1)
        let New = m.charAt(2)+m.charAt(3)
        arr.push([Old,New])
    })
    return arr
}

onmessage=function(event){
        console.log(move(event.data[0],event.data[1]))
        if(!gameStates.wIsQueening&&!gameStates.bIsQueening){
            let result = calcMoves(false)
            move(result[0],result[1])
            postMessage(result)
            console.log("result:",result)

            if(gameStates.bIsQueening){
            console.log(`queening:${gameStates.bIsQueening}`)
            move("Q")
            postMessage(["Q",null])
            }
        }
}









