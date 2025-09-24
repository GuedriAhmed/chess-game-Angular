import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WebSocketService } from '../services/websocket.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './board.html',
  styleUrls: ['./board.css']
})
export class Board implements OnInit, OnDestroy {
  rows = Array.from({ length: 8 }, (_, i) => i);
  cols = Array.from({ length: 8 }, (_, i) => i);

  board: string[][] = [
    ['r','n','b','q','k','b','n','r'],
    ['p','p','p','p','p','p','p','p'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['P','P','P','P','P','P','P','P'],
    ['R','N','B','Q','K','B','N','R']
  ];

  pieces: Record<string,string> = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
  };

  onlinePlayers: string[] = [];
  searchTerm: string = '';
  private onlineSub!: Subscription;

  constructor(private router: Router, private wsService: WebSocketService) {}

  ngOnInit() {
    
    // Connect to WebSocket
    this.wsService.connect('Ahmed');

    // Subscribe to online players updates
    this.onlineSub = this.wsService.onlinePlayers$.subscribe(players => {
    this.onlinePlayers = players;
    });

    // Announce yourself (replace with dynamic username)
    this.wsService.announceOnline('Ahmed');
  }

  ngOnDestroy() {
  this.onlineSub.unsubscribe();
  this.wsService.disconnect();
}

  getPiece(row: number, col: number): string {
    const piece = this.board[row][col];
    return this.pieces[piece] || '';
  }

  isDarkSquare(row: number, col: number): boolean {
    return (row + col) % 2 === 1;
  }

  get filteredPlayers(): string[] {
    return this.onlinePlayers.filter(player =>
      player.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Handle drag-drop move
  drop(event: CdkDragDrop<any>, row: number, col: number) {
  const piece = this.board[event.item.data.row][event.item.data.col];
  this.board[event.item.data.row][event.item.data.col] = '';
  this.board[row][col] = piece;

  // Broadcast the move via WebSocket
  this.wsService.sendMove({
    rowFrom: event.item.data.row,
    colFrom: event.item.data.col,
    rowTo: row,
    colTo: col
  });
}


  broadcastMove(rowFrom: number, colFrom: number, rowTo: number, colTo: number) {
    const move = { rowFrom, colFrom, rowTo, colTo };
    this.wsService.sendMove(move); // Make sure sendMove is implemented in WebSocketService
  }

  sendInvitation(player: string) {
    console.log(`Invite sent to ${player}`);
    // TODO: Call backend to send invitation
  }

  confirmExit() {
    if (confirm("Are you sure you want to leave the game?")) {
      this.router.navigate(['/home']);
    }
  }
}
