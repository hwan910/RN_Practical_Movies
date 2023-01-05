import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import styled from "@emotion/native";
import Swiper from "react-native-swiper";
import { Slide } from "../components/Slide";
import { VCard } from "../components/VCard";
import { HCard } from "../components/HCard";
import { FlatList } from "react-native";

export default function Movies() {
  const [nowPlayings, setNowPlayings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const BASE_URL = "https://api.themoviedb.org/3/movie";
  const API_KEY = "b52184cdcb2f0c2f86120a809cb0f244";

  const getNowPlayings = async () => {
    const { results } = await fetch(
      `${BASE_URL}/now_playing?api_key=${API_KEY}&language=en-US&page=1`
    ).then((res) => res.json());
    setNowPlayings(results);
  };

  const getTopRated = async () => {
    const { results } = await fetch(
      `${BASE_URL}/top_rated?api_key=${API_KEY}&language=en-US&page=1`
    ).then((res) => res.json());
    setTopRated(results);
  };

  const getUpcoming = async () => {
    const { results } = await fetch(
      `${BASE_URL}/upcoming?api_key=${API_KEY}&language=en-US&page=1`
    ).then((res) => res.json());
    setUpcoming(results);
  };

  const getData = async () => {
    await Promise.all([getNowPlayings(), getTopRated(), getUpcoming()]);
    setIsLoading(false);
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await getData();
    setIsRefreshing(false);
  };

  useEffect(() => {
    getData();
  }, []);

  if (isLoading) {
    return (
      <Loader>
        <ActivityIndicator />
      </Loader>
    );
  }
  return (
    <>
      <FlatList
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={
          <>
            <Swiper height="100%" showsPagination={false} autoplay loop>
              {nowPlayings.map((movie) => (
                <Slide key={movie.id} movie={movie} />
              ))}
            </Swiper>
            <ListTitle>Top Rated Movies</ListTitle>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={false}
              data={topRated}
              renderItem={({ item }) => <VCard movie={item} />}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={<View style={{ width: 10 }} />}
            />
            <ListTitle>Upcoming Movies</ListTitle>
            {/* 리스트헤더 컴퍼넌트로 뺴는 구역 */}
          </>
        }
        data={upcoming}
        renderItem={({ item }) => <HCard movie={item} />}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={<View style={{ height: 10 }} />}
      />
      {/* 리스트헤더 컴퍼넌트로 뺴는 구역 */}
    </>
  );
}

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ListTitle = styled.Text`
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 20px;
  font-size: 20px;
  font-weight: 500;
  color: ${(props) => props.theme.title};
`;
