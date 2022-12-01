export default [{
  type: 'post',
  url: '/system/admin/staffLogin',
  response: (data) => {
    return {
      code: 200,
      data: {
        nickname: 'Miracle-',
        jwtToken: 'iweoiriweiwioerw',
        permMenus: [
          {
            name: 'home',
            children: [
              { name: 'commonHome' },
              {
                name: 'system',
                children: [
                  { name: 'organization' },
                  { name: 'permission' },
                ]
              },
              {
                name: 'order',
                children: [
                  { name: 'orderTrack' },
                  { name: 'orderFund' },
                ]
              },
              { name: 'cargo' },
            ]
          },
        ]
      }
    }
  }
}, {
  type: 'post',
  url: '/system/org/listData',
  response: (req) => {
    const searchParam = req.body;
    console.log('searchParam', searchParam);
    const listData = [
      {
        id: 26,
        pId: 2,
        pIds: "[2]",
        orgCode: "QC-PART",
        orgName: "QC部",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: -1,
        isLeaf: 1,
        sortNo: 7,
        tierLevel: 1,
        scopeKey: "1-7",
        createTime: "2022-08-24T15:13:28",
        creatorName: "奇迹哥",
        updateTime: "2022-08-24T15:13:28",
        updaterName: "奇迹哥",
      },
      {
        id: 25,
        pId: 10,
        pIds: "[2,9,10]",
        orgCode: "James(YW)",
        orgName: "James组(YW)",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: 0,
        isLeaf: 1,
        sortNo: 1,
        tierLevel: 3,
        scopeKey: "1-2-1-1",
        createTime: "2022-08-12T15:56:53",
        creatorName: "奇迹哥",
        updateTime: "2022-08-12T15:57:33",
      },
      {
        id: 24,
        pId: 19,
        pIds: "[2,20,3,19]",
        orgCode: "Candy(GZ-KJ)",
        orgName: "Candy组(GZ-SC)",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: 1,
        isLeaf: 1,
        sortNo: 1,
        tierLevel: 4,
        scopeKey: "1-1-1-4-1",
        createTime: "2022-08-05T11:26:59",
        creatorName: "奇迹哥",
        updateTime: "2022-08-05T11:26:59",
      },
      {
        id: 20,
        pId: 2,
        pIds: "[2]",
        orgCode: "GuangZhouFenBu",
        orgName: "广州分部",
        orgDesc: "管理广州分区的事务",
        address: "",
        contact: "",
        email: "",
        orgStatus: 1,
        isLeaf: 0,
        sortNo: 1,
        tierLevel: 1,
        scopeKey: "1-1",
        createTime: "2022-05-11T14:15:52",
        creatorName: "奇迹哥",
        updateTime: "2022-05-11T15:08:23",
      },
      {
        id: 19,
        pId: 3,
        pIds: "[2,20,3]",
        orgCode: "KuaYue",
        orgName: "跨境组",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: 1,
        isLeaf: 0,
        sortNo: 4,
        tierLevel: 3,
        scopeKey: "1-1-1-4",
        createTime: "2021-11-29T13:00:54",
        creatorName: "奇迹哥",
        updateTime: "2022-08-05T11:29:10",
      },
      {
        id: 18,
        pId: 0,
        pIds: "[0]",
        orgCode: "BOSSGroup",
        orgName: "BOSS组",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: 1,
        isLeaf: 1,
        sortNo: 5,
        tierLevel: 0,
        scopeKey: "13",
        createTime: "2021-11-12T14:34:52",
        creatorName: "奇迹哥",
        updateTime: "2021-11-25T14:24:56",
      },
      {
        id: 17,
        pId: 3,
        pIds: "[2,20,3]",
        orgCode: "SiteGroup",
        orgName: "网销组",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: 1,
        isLeaf: 1,
        sortNo: 3,
        tierLevel: 3,
        scopeKey: "1-1-1-3",
        createTime: "2021-11-12T14:11:57",
        creatorName: "奇迹哥",
        updateTime: "2022-05-11T15:24:47",
      },
      {
        id: 23,
        pId: 4,
        pIds: "[2,4]",
        orgCode: "ServerBgroup",
        orgName: "关务B组",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: -1,
        isLeaf: 1,
        sortNo: 2,
        tierLevel: 2,
        scopeKey: "1-4-2",
        createTime: "2022-05-26T09:30:00",
        creatorName: "奇迹哥",
        updateTime: "2022-05-26T09:30:00",
      },
      {
        id: 22,
        pId: 4,
        pIds: "[2,4]",
        orgCode: "ServerAgroup",
        orgName: "关务A组",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: 0,
        isLeaf: 1,
        sortNo: 1,
        tierLevel: 2,
        scopeKey: "1-4-1",
        createTime: "2022-05-26T09:29:33",
        creatorName: "奇迹哥",
        updateTime: "2022-05-26T09:29:33",
      },
      {
        id: 21,
        pId: 15,
        pIds: "[2,20,3,15]",
        orgCode: "GroupA(GZ-SC)",
        orgName: "A组(GZ-SC)",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: 1,
        isLeaf: 1,
        sortNo: 1,
        tierLevel: 4,
        scopeKey: "1-1-1-1-1",
        createTime: "2022-05-11T17:37:24",
        creatorName: "奇迹哥",
        updateTime: "2022-05-11T17:37:24",
      },
      {
        id: 26,
        pId: 2,
        pIds: "[2]",
        orgCode: "QC-PART",
        orgName: "QC部",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: -1,
        isLeaf: 1,
        sortNo: 7,
        tierLevel: 1,
        scopeKey: "1-7",
        createTime: "2022-08-24T15:13:28",
        creatorName: "奇迹哥",
        updateTime: "2022-08-24T15:13:28",
        updaterName: "奇迹哥",
      },
      {
        id: 25,
        pId: 10,
        pIds: "[2,9,10]",
        orgCode: "James(YW)",
        orgName: "James组(YW)",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: 0,
        isLeaf: 1,
        sortNo: 1,
        tierLevel: 3,
        scopeKey: "1-2-1-1",
        createTime: "2022-08-12T15:56:53",
        creatorName: "奇迹哥",
        updateTime: "2022-08-12T15:57:33",
      },
      {
        id: 20,
        pId: 2,
        pIds: "[2]",
        orgCode: "GuangZhouFenBu",
        orgName: "广州分部",
        orgDesc: "管理广州分区的事务",
        address: "",
        contact: "",
        email: "",
        orgStatus: 1,
        isLeaf: 0,
        sortNo: 1,
        tierLevel: 1,
        scopeKey: "1-1",
        createTime: "2022-05-11T14:15:52",
        creatorName: "奇迹哥",
        updateTime: "2022-05-11T15:08:23",
      },
      {
        id: 19,
        pId: 3,
        pIds: "[2,20,3]",
        orgCode: "KuaYue",
        orgName: "跨境组",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: 1,
        isLeaf: 0,
        sortNo: 4,
        tierLevel: 3,
        scopeKey: "1-1-1-4",
        createTime: "2021-11-29T13:00:54",
        creatorName: "奇迹哥",
        updateTime: "2022-08-05T11:29:10",
      },
      {
        id: 18,
        pId: 0,
        pIds: "[0]",
        orgCode: "BOSSGroup",
        orgName: "BOSS组",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: 1,
        isLeaf: 1,
        sortNo: 5,
        tierLevel: 0,
        scopeKey: "13",
        createTime: "2021-11-12T14:34:52",
        creatorName: "奇迹哥",
        updateTime: "2021-11-25T14:24:56",
      },
      {
        id: 17,
        pId: 3,
        pIds: "[2,20,3]",
        orgCode: "SiteGroup",
        orgName: "网销组",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: 1,
        isLeaf: 1,
        sortNo: 3,
        tierLevel: 3,
        scopeKey: "1-1-1-3",
        createTime: "2021-11-12T14:11:57",
        creatorName: "奇迹哥",
        updateTime: "2022-05-11T15:24:47",
      },
      {
        id: 26,
        pId: 2,
        pIds: "[2]",
        orgCode: "QC-PART",
        orgName: "QC部",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: -1,
        isLeaf: 1,
        sortNo: 7,
        tierLevel: 1,
        scopeKey: "1-7",
        createTime: "2022-08-24T15:13:28",
        creatorName: "奇迹哥",
        updateTime: "2022-08-24T15:13:28",
        updaterName: "奇迹哥",
      },
      {
        id: 25,
        pId: 10,
        pIds: "[2,9,10]",
        orgCode: "James(YW)",
        orgName: "James组(YW)",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: 0,
        isLeaf: 1,
        sortNo: 1,
        tierLevel: 3,
        scopeKey: "1-2-1-1",
        createTime: "2022-08-12T15:56:53",
        creatorName: "奇迹哥",
        updateTime: "2022-08-12T15:57:33",
      },
      {
        id: 24,
        pId: 19,
        pIds: "[2,20,3,19]",
        orgCode: "Candy(GZ-KJ)",
        orgName: "Candy组(GZ-SC)",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: 1,
        isLeaf: 1,
        sortNo: 1,
        tierLevel: 4,
        scopeKey: "1-1-1-4-1",
        createTime: "2022-08-05T11:26:59",
        creatorName: "奇迹哥",
        updateTime: "2022-08-05T11:26:59",
      },
      {
        id: 23,
        pId: 4,
        pIds: "[2,4]",
        orgCode: "ServerBgroup",
        orgName: "关务B组",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: -1,
        isLeaf: 1,
        sortNo: 2,
        tierLevel: 2,
        scopeKey: "1-4-2",
        createTime: "2022-05-26T09:30:00",
        creatorName: "奇迹哥",
        updateTime: "2022-05-26T09:30:00",
      },
      {
        id: 24,
        pId: 19,
        pIds: "[2,20,3,19]",
        orgCode: "Candy(GZ-KJ)",
        orgName: "Candy组(GZ-SC)",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: 1,
        isLeaf: 1,
        sortNo: 1,
        tierLevel: 4,
        scopeKey: "1-1-1-4-1",
        createTime: "2022-08-05T11:26:59",
        creatorName: "奇迹哥",
        updateTime: "2022-08-05T11:26:59",
      },
      {
        id: 23,
        pId: 4,
        pIds: "[2,4]",
        orgCode: "ServerBgroup",
        orgName: "关务B组",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: -1,
        isLeaf: 1,
        sortNo: 2,
        tierLevel: 2,
        scopeKey: "1-4-2",
        createTime: "2022-05-26T09:30:00",
        creatorName: "奇迹哥",
        updateTime: "2022-05-26T09:30:00",
      },
      {
        id: 22,
        pId: 4,
        pIds: "[2,4]",
        orgCode: "ServerAgroup",
        orgName: "关务A组",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: 0,
        isLeaf: 1,
        sortNo: 1,
        tierLevel: 2,
        scopeKey: "1-4-1",
        createTime: "2022-05-26T09:29:33",
        creatorName: "奇迹哥",
        updateTime: "2022-05-26T09:29:33",
      },
      {
        id: 21,
        pId: 15,
        pIds: "[2,20,3,15]",
        orgCode: "GroupA(GZ-SC)",
        orgName: "A组(GZ-SC)",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: 1,
        isLeaf: 1,
        sortNo: 1,
        tierLevel: 4,
        scopeKey: "1-1-1-1-1",
        createTime: "2022-05-11T17:37:24",
        creatorName: "奇迹哥",
        updateTime: "2022-05-11T17:37:24",
      },
      {
        id: 22,
        pId: 4,
        pIds: "[2,4]",
        orgCode: "ServerAgroup",
        orgName: "关务A组",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: 0,
        isLeaf: 1,
        sortNo: 1,
        tierLevel: 2,
        scopeKey: "1-4-1",
        createTime: "2022-05-26T09:29:33",
        creatorName: "奇迹哥",
        updateTime: "2022-05-26T09:29:33",
      },
      {
        id: 21,
        pId: 15,
        pIds: "[2,20,3,15]",
        orgCode: "GroupA(GZ-SC)",
        orgName: "A组(GZ-SC)",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: 1,
        isLeaf: 1,
        sortNo: 1,
        tierLevel: 4,
        scopeKey: "1-1-1-1-1",
        createTime: "2022-05-11T17:37:24",
        creatorName: "奇迹哥",
        updateTime: "2022-05-11T17:37:24",
      },
      {
        id: 20,
        pId: 2,
        pIds: "[2]",
        orgCode: "GuangZhouFenBu",
        orgName: "广州分部",
        orgDesc: "管理广州分区的事务",
        address: "",
        contact: "",
        email: "",
        orgStatus: 1,
        isLeaf: 0,
        sortNo: 1,
        tierLevel: 1,
        scopeKey: "1-1",
        createTime: "2022-05-11T14:15:52",
        creatorName: "奇迹哥",
        updateTime: "2022-05-11T15:08:23",
      },
      {
        id: 24,
        pId: 19,
        pIds: "[2,20,3,19]",
        orgCode: "Candy(GZ-KJ)",
        orgName: "Candy组(GZ-SC)",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: 1,
        isLeaf: 1,
        sortNo: 1,
        tierLevel: 4,
        scopeKey: "1-1-1-4-1",
        createTime: "2022-08-05T11:26:59",
        creatorName: "奇迹哥",
        updateTime: "2022-08-05T11:26:59",
      },
      {
        id: 23,
        pId: 4,
        pIds: "[2,4]",
        orgCode: "ServerBgroup",
        orgName: "关务B组",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: -1,
        isLeaf: 1,
        sortNo: 2,
        tierLevel: 2,
        scopeKey: "1-4-2",
        createTime: "2022-05-26T09:30:00",
        creatorName: "奇迹哥",
        updateTime: "2022-05-26T09:30:00",
      },
      {
        id: 22,
        pId: 4,
        pIds: "[2,4]",
        orgCode: "ServerAgroup",
        orgName: "关务A组",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: 0,
        isLeaf: 1,
        sortNo: 1,
        tierLevel: 2,
        scopeKey: "1-4-1",
        createTime: "2022-05-26T09:29:33",
        creatorName: "奇迹哥",
        updateTime: "2022-05-26T09:29:33",
      },
      {
        id: 21,
        pId: 15,
        pIds: "[2,20,3,15]",
        orgCode: "GroupA(GZ-SC)",
        orgName: "A组(GZ-SC)",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: 1,
        isLeaf: 1,
        sortNo: 1,
        tierLevel: 4,
        scopeKey: "1-1-1-1-1",
        createTime: "2022-05-11T17:37:24",
        creatorName: "奇迹哥",
        updateTime: "2022-05-11T17:37:24",
      },
      {
        id: 20,
        pId: 2,
        pIds: "[2]",
        orgCode: "GuangZhouFenBu",
        orgName: "广州分部",
        orgDesc: "管理广州分区的事务",
        address: "",
        contact: "",
        email: "",
        orgStatus: 1,
        isLeaf: 0,
        sortNo: 1,
        tierLevel: 1,
        scopeKey: "1-1",
        createTime: "2022-05-11T14:15:52",
        creatorName: "奇迹哥",
        updateTime: "2022-05-11T15:08:23",
      },
      {
        id: 19,
        pId: 3,
        pIds: "[2,20,3]",
        orgCode: "KuaYue",
        orgName: "跨境组",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: 1,
        isLeaf: 0,
        sortNo: 4,
        tierLevel: 3,
        scopeKey: "1-1-1-4",
        createTime: "2021-11-29T13:00:54",
        creatorName: "奇迹哥",
        updateTime: "2022-08-05T11:29:10",
      },
      {
        id: 18,
        pId: 0,
        pIds: "[0]",
        orgCode: "BOSSGroup",
        orgName: "BOSS组",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: 1,
        isLeaf: 1,
        sortNo: 5,
        tierLevel: 0,
        scopeKey: "13",
        createTime: "2021-11-12T14:34:52",
        creatorName: "奇迹哥",
        updateTime: "2021-11-25T14:24:56",
      },
      {
        id: 17,
        pId: 3,
        pIds: "[2,20,3]",
        orgCode: "SiteGroup",
        orgName: "网销组",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: 1,
        isLeaf: 1,
        sortNo: 3,
        tierLevel: 3,
        scopeKey: "1-1-1-3",
        createTime: "2021-11-12T14:11:57",
        creatorName: "奇迹哥",
        updateTime: "2022-05-11T15:24:47",
      },
      {
        id: 26,
        pId: 2,
        pIds: "[2]",
        orgCode: "QC-PART",
        orgName: "QC部",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: -1,
        isLeaf: 1,
        sortNo: 7,
        tierLevel: 1,
        scopeKey: "1-7",
        createTime: "2022-08-24T15:13:28",
        creatorName: "奇迹哥",
        updateTime: "2022-08-24T15:13:28",
        updaterName: "奇迹哥",
      },
      {
        id: 25,
        pId: 10,
        pIds: "[2,9,10]",
        orgCode: "James(YW)",
        orgName: "James组(YW)",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: 0,
        isLeaf: 1,
        sortNo: 1,
        tierLevel: 3,
        scopeKey: "1-2-1-1",
        createTime: "2022-08-12T15:56:53",
        creatorName: "奇迹哥",
        updateTime: "2022-08-12T15:57:33",
      },
      {
        id: 19,
        pId: 3,
        pIds: "[2,20,3]",
        orgCode: "KuaYue",
        orgName: "跨境组",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: 1,
        isLeaf: 0,
        sortNo: 4,
        tierLevel: 3,
        scopeKey: "1-1-1-4",
        createTime: "2021-11-29T13:00:54",
        creatorName: "奇迹哥",
        updateTime: "2022-08-05T11:29:10",
      },
      {
        id: 18,
        pId: 0,
        pIds: "[0]",
        orgCode: "BOSSGroup",
        orgName: "BOSS组",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: 1,
        isLeaf: 1,
        sortNo: 5,
        tierLevel: 0,
        scopeKey: "13",
        createTime: "2021-11-12T14:34:52",
        creatorName: "奇迹哥",
        updateTime: "2021-11-25T14:24:56",
      },
      {
        id: 17,
        pId: 3,
        pIds: "[2,20,3]",
        orgCode: "SiteGroup",
        orgName: "网销组",
        orgDesc: "",
        address: "",
        contact: "",
        email: "",
        orgStatus: 1,
        isLeaf: 1,
        sortNo: 3,
        tierLevel: 3,
        scopeKey: "1-1-1-3",
        createTime: "2021-11-12T14:11:57",
        creatorName: "奇迹哥",
        updateTime: "2022-05-11T15:24:47",
      }
    ];
    const resData = listData.slice((searchParam.current - 1) * searchParam.size, searchParam.current * searchParam.size);
    return {
      code: 200,
      data: {
        total: listData.length,
        records: resData,
      },
    }
  }
}]
