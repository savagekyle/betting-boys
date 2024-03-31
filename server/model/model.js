import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const teamSchema = new mongoose.Schema({
    _id: {
        type: ObjectId,
    },
    teamName: {
        required: true,
        type: String,
    },
    season: [{
        type: Object,
        seasonYear: {
            type: Object,
            gameNumber: {
                opponet: {
                    type: String
                },
                homeTeam: {
                    type: String
                },
                odds_before: {
                    totals: {
                        over: {
                            price: {
                                type: String
                            },
                            point: {
                                type: String
                            }
                        },
                        under: {
                            price: {
                                type: String
                            },
                            point: {
                                type: String
                            }
                        }
                    },
                    spreads: {
                        team1: {
                            price: {
                                type: String
                            },
                            point: {
                                type: String
                            }
                        },
                        team2: {
                            price: {
                                type: String
                            },
                            point: {
                                type: String
                            }
                        }
                    }
                }

            }
        }
    }]
})

const gameResultsSchema = new mongoose.Schema([{
    winner: {
        type: String
    },
    overResult: {
        type: Boolean
    },
    underResult: {
        type: Boolean
    },
    spreadResults: {
        team1: {
            name: {
                type: String
            },
            spreadResult: {
                type: Boolean
            }
        },
        team2: {
            name: {
                type: String
            },
            spreadResult: {
                type: Boolean
            }
        }
    }
}])

const gameSchema = new mongoose.Schema({
    _id: {
        type: ObjectId,
    },
    game: {
        type: Object,
        homeTeam: {
            type: String
        },
        awayTeam: {
            type: String
        },
        odds_before: {
            h2h: {
                team1: {
                    name: {
                        type: String
                    },
                    price: {
                        type: String
                    }
                },
                team2: {
                    name: {
                        type: String
                    },
                    price: {
                        type: String
                    }
                }
            },
            spreads: {
                team1: {
                    name: {
                        type: String
                    },
                    price: {
                        type: String
                    },
                    point: {
                        type: String
                    }
                },
                team2: {
                    name: {
                        type: String
                    },
                    price: {
                        type: String
                    },
                    point: {
                        type: String
                    }
                }
            },
            totals: {
                over: {
                    price: {
                        type: String
                    },
                    point: {
                        type: String
                    }
                },
                under: {
                    price: {
                        type: String
                    },
                    point: {
                        type: String
                    }
                }
            }
        },
        commenceTime: {
            type: String
        },

    },
    results: [gameResultsSchema]
})




export const Team = mongoose.models.nhl_teams || mongoose.model("nhl_teams", teamSchema)

export const Game = mongoose.models.nhl_bets || mongoose.model("nhl_bets", gameSchema)

export const GameResults = mongoose.models.nhl_bets || mongoose.model("nhl_bets", gameResultsSchema)