import { Article } from './types'

export const ARTICLES: Record<string, Article> = {
  'nike-af1': {
    id: 'nike-af1',
    numericId: 101,
    title: "How Nike turned a $40 shoe into a $40 billion cultural movement",
    summary: "Nike didn't sell sneakers. They sold an identity. A deep dive into the campaign machinery that made Air Force 1 the most recognisable silhouette in streetwear history.",
    category: 'Sports',
    readTime: '6 min read',
    publishedDate: 'Sept 24, 2024',
    heroImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&h=900&fit=crop&auto=format',
    author: {
      name: 'Marcus Vance',
      role: 'Head of Brand Strategy at FGA',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face&auto=format',
      handle: '@marcusvance',
    },
    keyTakeaways: [
      "Subcultural Adoption Over Mass Advertising: Nike let Baltimore inner-city retail clubs save the shoe from discontinuation rather than pushing top-down TV spots.",
      "Scarcity Engineering via Regional Colorways: The 'Color of the Month' campaign invented sneaker drops 15 years before the Internet made it an industry standard.",
      "The Anti-Hero Halo Effect: Endorsements weren't contracted corporate athletes—they were hip-hop pioneers wearing triple-whites organically."
    ],
    tags: ['#Streetwear', '#Nike', '#Branding', '#SneakerCulture', '#GuerrillaMarketing'],
    stats: [
      { label: 'Annual Revenue', value: '$800M+' },
      { label: 'Wholesale Launch (1982)', value: '$89.95' },
      { label: 'Total Units Sold', value: '10M+ / yr' },
    ],
    slides: [
      {
        id: 1,
        title: "Slide 01: The 1984 Discontinuation Notice",
        subtitle: "The shoe Nike almost killed",
        caption: "Nike's standard lifecycle dictated retiring shoes after two seasons. AF1 was slated for extinction.",
        imageUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&h=450&fit=crop&auto=format"
      },
      {
        id: 2,
        title: "Slide 02: The 'Three Amigos' Retailers",
        subtitle: "Baltimore's Cinderella Coalition",
        caption: "Cinderella Shoes, Charley Rudo, and Downtown Locker Room flew to Beaverton and demanded 1,200 pairs per custom color.",
        imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=450&fit=crop&auto=format"
      },
      {
        id: 3,
        title: "Slide 03: The 'Color of the Month' Drop",
        subtitle: "The grandfather of hype drops",
        caption: "Every single month, a new limited colorway hit shelves and sold out within 48 hours without a single national print ad.",
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=450&fit=crop&auto=format"
      },
      {
        id: 4,
        title: "Slide 04: The Hip-Hop Canonical Uniform",
        subtitle: "The Pristine Triple-White Rule",
        caption: "Wearing creased or scuffed AF1s became taboo in NYC & Harlem. Buying fresh pairs weekly turned shoes into consumer subscription goods.",
        imageUrl: "https://images.unsplash.com/photo-1512374382149-233c42b6613c?w=800&h=450&fit=crop&auto=format"
      }
    ],
    content: {
      intro: [
        "In 1984, Nike made an executive decision that would have erased tens of billions of dollars from future balance sheets: they scheduled the Air Force 1 for termination.",
        "To Beaverton's bean-counters, the shoe was merely a bulky, obsolete basketball high-top designed by Bruce Kilgore that had run its standard 24-month product cycle. But what corporate headquarters failed to notice was taking place 2,500 miles away in the streets of Baltimore and Harlem."
      ],
      sections: [
        {
          heading: "1. The Grassroots Resistance in Baltimore",
          subheading: "When retailers tell the brand how to do product strategy",
          body: [
            "Three local sneaker shop owners in Baltimore—affectionately dubbed 'The Three Amigos'—noticed people driving up from Philadelphia, Washington D.C., and New York just to track down leftover deadstock pairs of Air Force 1s.",
            "They booked a flight to Nike's headquarters in Oregon and offered a risky proposition: if Nike would manufacture 1,200 pairs exclusively for them in new, one-off colorways, they would guarantee to buy out the entire inventory upfront.",
            "Nike reluctantly agreed. The first shipment arrived on a Saturday morning. By Sunday evening, every single pair was gone."
          ],
          quote: {
            text: "Nike didn't create sneakerhead culture. Baltimore's inner-city youth created it, and Nike was smart enough to stop trying to control it and simply supply the flame.",
            author: "Bob Gamm, Footwear Historian"
          },
          callout: "Key Insight: The greatest product marketing doesn't create user obsession from scratch; it detects emerging consumer rituals and builds an infrastructure around them."
        },
        {
          heading: "2. Inventing the 'Drop' Mechanics Before the Web",
          subheading: "The 'Color of the Month' Club",
          body: [
            "Following the initial Baltimore experiment, Nike launched the 'Color of the Month' program in 1986. Each month brought a distinctive variation: royal blue swoosh, chocolate brown gum sole, forest green trim.",
            "Without Instagram, Discord, or push notifications, word spread strictly through barbershops, radio stations, and street corners. Collectors didn't just buy to wear; they bought to archive.",
            "By deliberately limiting production runs to maintain secondary market velocity, Nike pioneered what would later become the fundamental playbook for Supreme, Yeezy, and modern luxury streetwear."
          ],
          image: {
            url: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1200&h=650&fit=crop&auto=format",
            caption: "The Air Force 1 silhouette transitioned from high-performance hardwood to timeless concrete canvas."
          }
        },
        {
          heading: "3. The 'Pristine White' Subscription Engine",
          subheading: "How a physical product adopted the business economics of SaaS",
          body: [
            "By the early 2000s, hip-hop icons like Jay-Z, Nelly, and Fat Joe had codified an unspoken consumer law: Air Force 1s were only acceptable if they were pristine, uncreased, and brilliant white.",
            "This cultural norm turned the shoe into a recurring consumable. Serious tastemakers didn't clean their sneakers; they threw them away or retired them after two wears and bought another $60 pair.",
            "Nelly's 2002 multi-platinum single 'Air Force Ones' wasn't a paid Nike sponsorship. It was organic cultural reverence that boosted Nike's sales by millions of pairs that quarter at $0 acquisition cost."
          ],
          quote: {
            text: "Give me two pairs, 'cause I need two purrs. So I can get to stompin' in my Air Force Ones.",
            author: "Nelly, St. Lunatics (2002)"
          }
        }
      ],
      conclusion: "The Air Force 1 proved that legendary branding isn't about telling people what your product means. It's about giving them an authentic artifact of high craftsmanship, letting subcultures endow it with their own mythologies, and maintaining the discipline not to dilute that magic for short-term revenue."
    }
  },

  '818-tequila': {
    id: '818-tequila',
    numericId: 102,
    title: "How 818 Tequila turned a beach club into a content factory",
    summary: "Kendall Jenner didn't just slap her name on an agave bottle. 818 constructed an experiential hospitality flywheel that generated 400M+ organic TikTok impressions.",
    category: 'PR Stunt',
    readTime: '5 min read',
    publishedDate: 'Sept 20, 2024',
    heroImage: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1600&h=900&fit=crop&auto=format',
    author: {
      name: 'Sofia Chen',
      role: 'Senior Cultural Analyst at FGA',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face&auto=format',
      handle: '@sofiachen'
    },
    keyTakeaways: [
      "The Experiential Asset Play: Instead of paying $5M for standard influencer ad reads, 818 leased physical spaces and redesigned them as organic photography sets.",
      "The FOMO Architecture: Invitation-only daytime activations with strict aesthetic guidelines turned guest creators into an unpaid distributed PR agency.",
      "Omnipresent Social Packaging: The earthy terracotta branding was intentionally matched to warm-toned social media aesthetics (Golden Hour filters)."
    ],
    tags: ['#Tequila', '#PRStunt', '#KendallJenner', '#CelebrityBrand', '#ExperientialMarketing'],
    stats: [
      { label: 'Earned Media Value', value: '$34.8M' },
      { label: 'TikTok Views', value: '420M+' },
      { label: 'First Year Volume', value: '136,000 cases' }
    ],
    slides: [
      {
        id: 1,
        title: "Slide 01: The Celebrity Spirit Saturation",
        subtitle: "Why 90% of celebrity alcohols fail",
        caption: "Between Casamigos, Teremana, and Aviation, consumers were suffering acute celebrity-tequila fatigue.",
        imageUrl: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=800&h=450&fit=crop&auto=format"
      },
      {
        id: 2,
        title: "Slide 02: Transforming Coachella Weekend into a Branded Micro-World",
        subtitle: "The Desert Outpost Strategy",
        caption: "Instead of a backstage VIP booth, 818 built a full-scale desert ranch activation complete with vintage Airstreams and branded merchandise.",
        imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=450&fit=crop&auto=format"
      },
      {
        id: 3,
        title: "Slide 03: The UGC Flywheel",
        subtitle: "When attendees market for you",
        caption: "Over 2,400 tier-1 lifestyle creators published unprompted stories because the physical environment elevated their own personal feeds.",
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=450&fit=crop&auto=format"
      }
    ],
    content: {
      intro: [
        "In 2021, when Kendall Jenner announced 818 Tequila, the backlash was swift and predictably intense. Detractors predicted a swift burial alongside scores of forgotten celebrity brand vanity projects.",
        "Three years later, 818 is among the fastest-growing spirits brands in the United States, outselling decades-old heritage houses in the ultra-premium segment."
      ],
      sections: [
        {
          heading: "1. The Death of the Traditional Billboard Campaign",
          subheading: "Why out-of-home posters don't convert Gen Z drinkers",
          body: [
            "Gen Z doesn't trust billboard proclamations or polished TV commercials. What moves tequila off the shelves is seeing peers order drinks that photograph immaculately in low light.",
            "818 treated their physical beach club and festival pop-ups not as sales counters, but as cinematographic soundstages designed specifically for iPhone 15 Pro lenses.",
            "Lighting angles, wooden textured bars, custom terracotta shot glasses, and bespoke typography ensured every glass served was instantly identifiable on an Instagram Story."
          ],
          quote: {
            text: "We never asked creators to hold the bottle facing the lens. If your environment is magnetic enough, the bottle is naturally the center of the frame.",
            author: "818 Creative Director"
          }
        },
        {
          heading: "2. The Campus Ambassador Blitzkrieg",
          subheading: "Taking over university culture from the ground up",
          body: [
            "While high-end influencers drove luxury perception, 818 executed a hyper-focused college campus tour. They targeted Greek life formals, spring break clubs, and university tailgates with branded merchandise lines that looked like contemporary streetwear.",
            "Students wore 818 hoodies and vintage caps to classes, turning campus foot traffic into a walking billboard for the brand."
          ]
        }
      ],
      conclusion: "818 Tequila demonstrated that in modern spirits marketing, liquid craftsmanship is table stakes—the real moat is building an aesthetic world that consumers want to rent a piece of for their Saturday night identities."
    }
  },

  'burger-king-moldy-whopper': {
    id: 'burger-king-moldy-whopper',
    numericId: 1,
    title: "Burger King's Moldy Whopper Was Disgusting on Purpose",
    summary: "How David the Agency and INGO turned 34 days of decomposing fast food into one of the most awarded campaigns in advertising history.",
    category: 'PR Stunt',
    readTime: '5 min read',
    publishedDate: 'Aug 14, 2024',
    heroImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600&h=900&fit=crop&auto=format',
    author: {
      name: 'Julian Hayes',
      role: 'Creative Effectiveness Lead at FGA',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&auto=format',
      handle: '@julianhayes'
    },
    keyTakeaways: [
      "Counter-Intuitive Sensory Inversion: By showcasing decomposition, BK proved the absence of artificial preservatives more convincingly than any wellness lecture.",
      "The Unspoken McDonald's Attack: The subtext preyed on viral internet rumors about immortal McDonald's burgers that never rot.",
      "Earned Media Over Paid Distribution: Grossing out the internet drove $40M in free broadcast news debate."
    ],
    tags: ['#FastFood', '#BurgerKing', '#PRStunt', '#ContrarianMarketing', '#CannesLions'],
    stats: [
      { label: 'Earned Media Value', value: '$40M+' },
      { label: 'Increase in Quality Perception', value: '+26%' },
      { label: 'Store Visit Intent', value: '+14%' }
    ],
    content: {
      intro: [
        "In February 2020, Burger King released a 45-second time-lapse video set to Aretha Franklin's soothing ballad 'What a Difference a Day Makes'.",
        "The footage showed a pristine Whopper being assembled, followed by 34 agonizing days of blue spores, white fuzz, and pungent decay. It ended with the line: 'The beauty of no artificial preservatives.'"
      ],
      sections: [
        {
          heading: "1. The Appetite Appeal Sacred Rule",
          subheading: "Breaking the first commandment of food advertising",
          body: [
            "For seventy years, the fundamental dogma of food marketing was simple: make the food look dripping, glistening, and mouth-wateringly fresh.",
            "Burger King committed the ultimate marketing heresy. They deliberately showed mold crawling over a burger patty.",
            "Why? Because the modern consumer was exhausted by sanitized corporate promises of 'all-natural ingredients'. By showing decay, Burger King gave undeniable physical proof that their food was real."
          ],
          quote: {
            text: "Real food decays. Only synthetic food stays pristine for a decade on a museum shelf.",
            author: "Fernando Machado, former CMO of Restaurant Brands International"
          }
        },
        {
          heading: "2. Weaponizing the Competitor's Myth",
          subheading: "Attacking McDonald's without saying their name",
          body: [
            "For decades, YouTube had been filled with videos of ten-year-old McDonald's Happy Meals preserved in glass jars without a speck of mold.",
            "Burger King never mentioned McDonald's in the copy. They didn't have to. Every single person who watched the Moldy Whopper instantly made the mental comparison.",
            "It was asymmetric psychological warfare executed at the highest level of creative craft."
          ]
        }
      ],
      conclusion: "The Moldy Whopper proved that bravery in advertising isn't about being loud—it's about having the conviction to show an ugly truth that proves a beautiful brand promise."
    }
  },

  'aviation-gin': {
    id: 'aviation-gin',
    numericId: 2,
    title: "Ryan Reynolds Turned Aviation Gin into a Brand Personality Playbook",
    summary: "How self-deprecating humor, 24-hour turnaround cycles, and meme-jacking created a $610 million exit to Diageo.",
    category: 'Celebrity',
    readTime: '7 min read',
    publishedDate: 'July 18, 2024',
    heroImage: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=1600&h=900&fit=crop&auto=format',
    author: {
      name: 'Sofia Chen',
      role: 'Senior Cultural Analyst at FGA',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face&auto=format',
      handle: '@sofiachen'
    },
    keyTakeaways: [
      "Fast Advertising Over High Production: Reynolds and Maximum Effort prioritized releasing an ad in 36 hours over spending 6 months in agency committee approval.",
      "Self-Aware Satire: By openly mocking the pretentiousness of spirits ads, Aviation disarmed cynical viewers and made them willing accomplices.",
      "The Peloton Hack: Hiring the viral 'Peloton wife' actress within 48 hours of her controversial commercial demonstrated unprecedented cultural agility."
    ],
    tags: ['#AviationGin', '#RyanReynolds', '#Celebrity', '#FastAdvertising', '#MaximumEffort'],
    stats: [
      { label: 'Diageo Acquisition', value: '$610M' },
      { label: 'Super Bowl Ad Budget', value: '$0' },
      { label: 'Organic YouTube Views', value: '180M+' }
    ],
    content: {
      intro: [
        "In 2018, actor Ryan Reynolds bought an equity stake in Aviation American Gin. Most industry analysts expected the usual: a glossy billboard in Hollywood, a boring cocktail recipe photo, and zero needle movement.",
        "Instead, Reynolds invented a new marketing genre: 'Fastvertising'—ads produced with the speed of internet gossip and the comedic punch of a blockbuster script."
      ],
      sections: [
        {
          heading: "1. The 48-Hour Peloton Turnaround",
          subheading: "Capturing a lightning rod cultural moment",
          body: [
            "In December 2019, Peloton aired an infamous holiday ad depicting a terrified-looking wife receiving an exercise bike from her husband. The internet was merciless in mocking it.",
            "Instead of laughing along like everyone else, Reynolds tracked down the actual actress, flew her to New York, shot a commercial where she and her friends drink Aviation Gin to recover from trauma, and published it within 48 hours.",
            "The ad became the top trending topic on Twitter, gained 10 million views in 24 hours, and cost almost nothing to produce."
          ],
          quote: {
            text: "Most brands take nine months to buy a media plan. By the time their ad comes out, the joke has been dead for half a year.",
            author: "Ryan Reynolds, Co-Founder Maximum Effort"
          }
        }
      ],
      conclusion: "Aviation Gin wasn't purchased by Diageo because its botanicals were superior. It was bought because Maximum Effort had built a cultural cheat code that could generate headline news on command."
    }
  },

  'jordan-banned-shoe': {
    id: 'jordan-banned-shoe',
    numericId: 3,
    title: "Jordan Brand's Banned Shoe: The Ad That Made Nike $162M",
    summary: "The NBA fined Michael Jordan $5,000 every time he wore them. Nike paid every single fine—and made it the cornerstone of basketball folklore.",
    category: 'Sports',
    readTime: '4 min read',
    publishedDate: 'June 10, 2024',
    heroImage: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1600&h=900&fit=crop&auto=format',
    author: {
      name: 'Marcus Vance',
      role: 'Head of Brand Strategy at FGA',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face&auto=format',
      handle: '@marcusvance'
    },
    keyTakeaways: [
      "Turning Regulatory Punishment into Bad-Boy Status: The NBA's uniform dress code rule became Nike's greatest endorsement.",
      "The Power of the Black Censorship Bars: The commercial didn't even show the shoe—two black bars covered his feet, instantly stoking teenage rebellion.",
      "Projecting $3M and Delivering $126M: First-year sales obliterated Nike's wildest financial forecasts."
    ],
    tags: ['#AirJordan', '#MichaelJordan', '#Nike', '#SportsMarketing', '#BannedCampaign'],
    stats: [
      { label: 'Year 1 Forecast', value: '$3.0M' },
      { label: 'Actual Year 1 Sales', value: '$126M' },
      { label: 'NBA Fine Per Game', value: '$5,000' }
    ],
    content: {
      intro: [
        "In 1984, the NBA issued a stern letter to the Chicago Bulls stating that Michael Jordan's red and black sneakers violated the league's '51% white shoe' dress code.",
        "Nike's marketing genius Rob Strasser saw the letter and smiled. It was the birth of the most lucrative sneaker franchise in human history."
      ],
      sections: [
        {
          heading: "1. The 1985 'Banned' Commercial",
          subheading: "Selling rebellion to suburban America",
          body: [
            "Nike aired a simple 30-second commercial. Jordan stood on a basketball court bouncing a ball while the camera panned slowly down his body.",
            "A voiceover calmly stated: 'On October 15, Nike created a revolutionary new basketball shoe. On October 18, the NBA threw them out of the game. Fortunately, the NBA can't stop you from wearing them.'",
            "Kids didn't just want a shoe. They wanted a weapon against authority."
          ],
          quote: {
            text: "Fortunately, the NBA can't stop you from wearing them.",
            author: "Chiat/Day Voiceover (1985)"
          }
        }
      ],
      conclusion: "When institutions ban your product, don't apologize. Frame the ban as proof of your product's unstoppable revolutionary power."
    }
  },

  'spotify-wrapped': {
    id: 'spotify-wrapped',
    numericId: 4,
    title: "Spotify Wrapped — Why Data Became the Most Shared Campaign of the Decade",
    summary: "How an intern's experiment transformed private listening telemetry into an annual global vanity festival.",
    category: 'Business',
    readTime: '6 min read',
    publishedDate: 'May 02, 2024',
    heroImage: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1600&h=900&fit=crop&auto=format',
    author: {
      name: 'Julian Hayes',
      role: 'Creative Effectiveness Lead at FGA',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&auto=format',
      handle: '@julianhayes'
    },
    keyTakeaways: [
      "Identity Packaging: Spotify realized users don't share statistics; they share curated representations of their personalities.",
      "The Annual Holiday Ritual: Scheduling the drop in early December capitalized on year-end self-reflection when social feeds are hungry for content.",
      "Free FOMO Acquisition: Seeing millions of Apple Music users post about missing out was the greatest competitive differentiator in streaming."
    ],
    tags: ['#Spotify', '#SpotifyWrapped', '#BigData', '#ViralLoop', '#ProductGrowth'],
    stats: [
      { label: 'Social Shares (2023)', value: '120M+' },
      { label: 'App Store Rank Jump', value: '#1 in 40+ countries' },
      { label: 'Competitor Churn', value: '+18% trial signups' }
    ],
    content: {
      intro: [
        "In 2015, a Spotify team sent out a humble email called 'Year in Music' displaying total minutes streamed and top artists. It was standard CRM marketing.",
        "By 2019, it had transformed into 'Spotify Wrapped'—an immersive, personalized social phenomenon that dominates Instagram, TikTok, and Twitter for 72 straight hours every December."
      ],
      sections: [
        {
          heading: "1. Designing for the Feed First",
          subheading: "Stories-native aspect ratio and bold neo-brutalist palettes",
          body: [
            "Spotify didn't create a desktop PDF or a complicated dashboard. They designed full-screen 9:16 mobile cards engineered specifically for single-tap Instagram Story exports.",
            "Each card validated the user's taste: 'You are in the top 0.05% of Taylor Swift listeners.' That isn't a metric; it's a tribal medal of honor."
          ]
        }
      ],
      conclusion: "The brilliance of Spotify Wrapped is converting surveillance capitalism into a personalized love letter that users enthusiastically broadcast to the entire world."
    }
  },

  'apple-shot-on-iphone': {
    id: 'apple-shot-on-iphone',
    numericId: 5,
    title: "Shot on iPhone — Year One: The Anatomy of a Masterclass",
    summary: "How Apple turned amateur camera photos into the largest global billboard gallery in human history.",
    category: 'Brands',
    readTime: '6 min read',
    publishedDate: 'April 12, 2024',
    heroImage: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1600&h=900&fit=crop&auto=format',
    author: {
      name: 'Marcus Vance',
      role: 'Head of Brand Strategy at FGA',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face&auto=format',
      handle: '@marcusvance'
    },
    keyTakeaways: [
      "Proof of Work Over Megapixel Specs: Instead of quoting camera sensor microns, Apple put giant 40-foot real photos on skyscraper sides.",
      "The Democratization of Art: Ordinary people in 24 countries woke up to find their hobby photos celebrated worldwide.",
      "Simplicity as Luxury: Just the image, 'Shot on iPhone 6', and the photographer's first name."
    ],
    tags: ['#Apple', '#ShotOniPhone', '#OutdoorAdvertising', '#Photography', '#BrandMinimalism'],
    stats: [
      { label: 'Billboards Deployed', value: '10,000+' },
      { label: 'Countries Featured', value: '25' },
      { label: 'Cannes Grand Prix', value: 'Won in Outdoor' }
    ],
    slides: [
      {
        id: 1,
        title: "Slide 01: The Megapixel War Dead End",
        subtitle: "Why spec sheets don't sell cameras",
        caption: "Samsung was bragging about 16MP sensors while Apple had 8MP. Apple refused to fight on engineering specs.",
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=800&h=450&fit=crop&auto=format"
      },
      {
        id: 2,
        title: "Slide 02: Scouring Instagram for Raw Genius",
        subtitle: "Curating 77 photographers out of millions",
        caption: "TBWA\\Media Arts Lab spent weeks browsing #iPhone hashtags to unearth ordinary people taking museum-quality stills.",
        imageUrl: "https://images.unsplash.com/photo-1502759683299-cdcd1a7b8ce5?w=800&h=450&fit=crop&auto=format"
      },
      {
        id: 3,
        title: "Slide 03: The Giant Skyscraper Canvas",
        subtitle: "Monuments of human creativity",
        caption: "Printing an unedited smartphone photo onto a 50-meter billboard in Tokyo and Dubai was the ultimate mic drop.",
        imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop&auto=format"
      }
    ],
    content: {
      intro: [
        "In early 2015, smartphone competitors were locked in a vicious specs race over megapixel counts and sensor aperture numbers.",
        "Apple didn't join the argument. Instead, they launched 'World Gallery'—better known as 'Shot on iPhone'. It would become one of the most celebrated OOH campaigns in marketing history."
      ],
      sections: [
        {
          heading: "1. The Radical Absence of Apple Tech Jargon",
          subheading: "Letting human wonder do the heavy lifting",
          body: [
            "There were no mention of F-stops, pixel bins, or image processing silicon. The billboards simply showed a staggering photo—a misty mountain in Scotland, a toddler laughing in Mumbai, a bird in flight.",
            "At the bottom, set in clean typography: 'Shot on iPhone 6 by Julian B.'"
          ]
        }
      ],
      conclusion: "When competitors market what their product *has*, market what your user *can create* with it."
    }
  }
}

// Fallback lookup or listing helper
export const ALL_ARTICLES_LIST: Article[] = Object.values(ARTICLES)
