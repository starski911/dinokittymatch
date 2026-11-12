import type { CardTemplate } from '../../types/game';
import trex from './trex.svg';
import stego from './stego.svg';
import blueyPup from './bluey_pup.svg';
import penguin from './penguin.svg';
import spaceRanger from './space_ranger.svg';
import toyAlien from './toy_alien.svg';
import helloKitty from './hello_kitty.svg';
import princessCrown from './princess_crown.svg';
import pinkCastle from './pink_castle.svg';
import cuteBunny from './cute_bunny.svg';
import cowgirlHat from './cowgirl_hat.svg';
import unicornPrincess from './unicorn_princess.svg';

export const CARD_CATALOG: CardTemplate[] = [
  { id: 'trex', name: 'T-Rex', team: 'blue', src: trex },
  { id: 'stego', name: 'Stego', team: 'blue', src: stego },
  { id: 'bluey_pup', name: 'Blue Pup', team: 'blue', src: blueyPup },
  { id: 'penguin', name: 'Penguin', team: 'blue', src: penguin },
  { id: 'space_ranger', name: 'Space Ranger', team: 'blue', src: spaceRanger },
  { id: 'toy_alien', name: 'Space Alien', team: 'blue', src: toyAlien },
  { id: 'hello_kitty', name: 'Bow Kitty', team: 'pink', src: helloKitty },
  { id: 'princess_crown', name: 'Princess', team: 'pink', src: princessCrown },
  { id: 'pink_castle', name: 'Castle', team: 'pink', src: pinkCastle },
  { id: 'cute_bunny', name: 'Bunny', team: 'pink', src: cuteBunny },
  { id: 'cowgirl_hat', name: 'Cowgirl', team: 'pink', src: cowgirlHat },
  { id: 'unicorn_princess', name: 'Unicorn', team: 'pink', src: unicornPrincess },
];
