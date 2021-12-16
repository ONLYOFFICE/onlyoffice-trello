export default Object.freeze({
    TRELLO_API: 'https://api.trello.com/1/',
    TRELLO_API_CARDS: 'https://api.trello.com/1/cards/',
    TRELLO_API_CARD(id: string): string{
        return this.TRELLO_API_CARDS + id;
    },
    TRELLO_API_CARD_ATTACHMENTS(id: string): string {
        return this.TRELLO_API_CARD(id)+'/attachments';
    },
    TRELLO_API_ME(token: string): string {
        return `${this.TRELLO_API}members/me?key=${process.env.POWERUP_APP_KEY}&token=${token}`;
    },
});
