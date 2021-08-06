import styled from 'styled-components'
import jsonData from './entities.json'
import {useEffect, useState} from "react";
import ClipLoader from "react-spinners/ClipLoader";
import MaterialIcon from 'material-icons-react';

const App = () => {
    const [isDataLoaded, setIsDataLoaded] = useState(false)
    const [data, setData] = useState({})
    const [favorites, setFavorites] = useState([])

    const getData = async () => {
        return await jsonData.response
    }

    const loadFavorites = () => {
        if (localStorage.getItem('favorites')) {
            setFavorites(JSON.parse(localStorage.getItem('favorites')))
        }
    }

    const saveFavorites = () => {
        localStorage.setItem('favorites', JSON.stringify([...favorites]))
    }

    useEffect(() => {
        loadFavorites()
        setTimeout(() => {
        getData().then(r => {
            setData(r)
            setIsDataLoaded(true)

            console.log('Data successfully loaded')
        }).catch(e => console.error(e))
        }, 1500)
    }, [])

    useEffect(() => {
        saveFavorites()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [favorites])

    const likeClickHandler = (e, id) => {
        console.log(id)
        if (favorites.includes(id)) {
            let array = [...favorites]
            array.splice(array.indexOf(id), 1)
            setFavorites([...array])
        } else {
            setFavorites([...favorites, id])
        }
    }

    return (
        <FlexContainer>
            {
                isDataLoaded ?
                    <GridContainer>
                        {
                            data.map((item, index) =>
                                <Card key={index}>
                                    <ImageContainer>
                                        <IMG src={'https://via.placeholder.com/400'} alt={'placeholder'}/>
                                    </ImageContainer>
                                    <TitleContainer>
                                        <Title>{item.attributes["title"]}</Title>
                                    </TitleContainer>
                                    <FlexContentContainer>
                                        <ContentContainer>
                                            <RoomsAndSquare first>{item.attributes["rooms"]}-комн.
                                                квартира</RoomsAndSquare>
                                            <RoomsAndSquare>
                                                {item.attributes["area"]}
                                                {item.attributes["unit"] === 'квм' ? <> м<sup>2</sup></> : item.attributes["unit"]}
                                            </RoomsAndSquare>
                                            <ContentText>{item.attributes["address"]["city"]}</ContentText>
                                            <ContentText>ул. {item.attributes["address"]["street"]},
                                                д. {item.attributes["address"]["house"]} кв. {item.attributes["address"]["room"]}</ContentText>
                                            <ContentText>
                                                {item['relationships']['type'] === 'agent' ? 'Агент' : item['relationships']['type']}&#160;-&#160;
                                                {item['relationships']['attributes']['last_name']}&#160;
                                                {item['relationships']['attributes']['first_name']}&#160;
                                                {item['relationships']['attributes']['middle_name']}
                                            </ContentText>
                                        </ContentContainer>
                                        <LikeContainer>
                                            <HeartButton active={favorites.includes(item.id)}
                                                       onClick={e => likeClickHandler(e, item.id)}>
                                                <MaterialIcon/>
                                                <HeartIcon active={favorites.includes(item.id)}>favorite</HeartIcon>
                                            </HeartButton>
                                        </LikeContainer>
                                    </FlexContentContainer>

                                </Card>
                            )
                        }
                    </GridContainer>
                    :
                    <>
                        <h3>Loading...</h3>
                        <ClipLoader color={'#2196f3'} loading={true} size={110}/>
                    </>
            }

        </FlexContainer>
    );
}

export default App;


const FlexContainer = styled.div`
  padding: 100px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

`

const GridContainer = styled.div`
  display: grid;
  grid-gap: 15px;
  grid-template-columns: repeat(3, 1fr);

  @media (min-width: 320px) {
    grid-template-columns: repeat(1, 1fr);
  }

  @media (min-width: 641px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 961px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1025px) {
    grid-template-columns: repeat(4, 1fr);
  }
`

const Card = styled.div`
  width: 350px;
  max-width: 400px;
  background-color: #fff;
  border: 1px solid #e6e6e6;
  border-radius: 5px;
  box-shadow: rgba(149, 157, 165, 0.2) 0 8px 24px;

  @media (min-width: 320px) {
    width: 100%;
  }

  @media (min-width: 481px) {
    width: 100%
  }

  @media (min-width: 641px) {
    width: 100%;
  }

  @media (min-width: 961px) {
    width: 100%;
  }
`

const ImageContainer = styled.div``

const FlexContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`

const LikeContainer = styled.div`
  display: flex;
  width: 70px;
  justify-content: center;
  align-items: start;
`

const ContentContainer = styled.div`
  flex-grow: 1;
  padding: 0 15px 10px 15px;
`;

const TitleContainer = styled.div`
  margin: 15px 15px 0 15px;
`

const Title = styled.h3`
  color: #333;
  margin-bottom: 10px;
`

const RoomsAndSquare = styled.span`
  padding-left: ${props => {
    if (props['first']) return 0
    return '6px'
  }};
  padding-right: 6px;
  border-right: 1px solid #d6dadc;
`

const ContentText = styled.p`
  padding-top: 8px;
`

const IMG = styled.img`
  max-width: 100%;
  width: 100%;
`;

const HeartButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #d2d2d2;
  cursor: pointer;

  ${props => {
    if (props['active'])
      return `background-color: #eb5a46;
                  border-color: #eb5a46;`
  }}

  &:hover {
    ${props => {
      if (!props['active'])
        return `background-color: #f6f6f6;`
    }}

  }
`

const HeartIcon = styled.i`
  font-family: 'Material Icons',sans-serif;
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline;
  white-space: nowrap;
  word-wrap: normal;
  vertical-align: middle;
  //direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
  color:   ${props => {
    if (props['active'])
      return `#fff`
    return '#acaeaf'
  }};
`;