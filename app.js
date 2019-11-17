let input = document.querySelector(".search");

document
  .querySelector("form.search-form")
  .addEventListener("submit", function(e) {
    e.preventDefault();
    let player = input.value;
    player = player.replace(/\s+/g, "+");
    document.querySelector(".search-form").reset();

    const player_searched = `https://www.balldontlie.io/api/v1/players?search=${player}`;

    fetch(player_searched)
      .then(resp => resp.json())
      .then(function(data) {
        if (data.data[0] === undefined) {
          const error = document.querySelector(".error");
          error.style.opacity = "100";
          error.innerHTML = "Player Not Found";
          setTimeout(function() {
            let sec = 5;
            error.style.opacity = "0";
          }, 5 * 1000);
        } else {
          let playerName =
            data.data[0].first_name + " " + data.data[0].last_name;
          let playerPos = data.data[0].position;
          let playerTeam = data.data[0].team.abbreviation;
          let player_id = data.data[0].id;
          addPlayer(player_id);
          let nameContainer = document.querySelectorAll(".name");
          let positionContainer = document.querySelectorAll(".position");
          let index = nameContainer.length - 1;
          nameContainer[index].textContent += playerName;
          positionContainer[index].textContent +=
            playerTeam + " | " + playerPos;
        }
      })
      .catch(err => console.error(err));

    function addPlayer(player_id) {
      let player_container = document.createElement("DIV");
      player_container.innerHTML = `
        <div class="left">
            <div class="left-inner">
                <div class="info">
                    <h1 class="name"></h1>
                    <h3 class="position"></h3>
                </div>
                <div class="stat_container">
                    <ul class="stat_headers list">
                        <li>PTS</li>
                        <li>FG%</li>
                        <li>3PT%</li>
                        <li>FT%</li>
                        <li>REB</li>
                        <li>AST</li>
                        <li>STL</li>
                        <li>BLK</li>
                    </ul>
                    <ul class="stats list">
                        <li class="aa pts"></li>
                        <li class="aa fg"></li>
                        <li class="aa fg3"></li>
                        <li class="aa ft"></li>
                        <li class="aa reb"></li>
                        <li class="aa ast"></li>
                        <li class="aa stl"></li>
                        <li class="aa blk"></li>
                    </ul>
                </div>  
               <div class="remove">
                <button class="remove-button fas fa-times-circle"></button>
               </div>   
            </div>
        </div>`;
      document.querySelector(".players-list").appendChild(player_container);

      getStats(player_id);

      const player_containers = document.querySelectorAll(".left");
      const removeButton = document.querySelectorAll(".remove-button");
      removeButton.forEach(function(button, index) {
        button.addEventListener("click", () => {
          player_containers[index].remove();
          updateMax();
        });
      });
    }

    function getStats(player_id) {
      let player_stats = `https://www.balldontlie.io/api/v1/season_averages?season=2019&player_ids[]=${player_id}`;
      fetch(player_stats)
        .then(resp => resp.json())
        .then(function(data) {
          let stat = {
            pts: data.data[0].pts.toFixed(1),
            fg: (data.data[0].fg_pct * 100).toFixed(1),
            fg3: (data.data[0].fg3_pct * 100).toFixed(1),
            ft: (data.data[0].ft_pct * 100).toFixed(1),
            reb: data.data[0].reb.toFixed(1),
            ast: data.data[0].ast.toFixed(1),
            stl: data.data[0].stl.toFixed(1),
            blk: data.data[0].blk.toFixed(1)
          };

          let container = document.querySelectorAll(".left");
          let ptContainer = document.querySelectorAll(".pts");
          let fgContainer = document.querySelectorAll(".fg");
          let fg3Container = document.querySelectorAll(".fg3");
          let ftContainer = document.querySelectorAll(".ft");
          let rebContainer = document.querySelectorAll(".reb");
          let astContainer = document.querySelectorAll(".ast");
          let stlContainer = document.querySelectorAll(".stl");
          let blkContainer = document.querySelectorAll(".blk");
          let index = container.length - 1;

          ptContainer[index].textContent += stat.pts;
          fgContainer[index].textContent += stat.fg;
          fg3Container[index].textContent += stat.fg3;
          ftContainer[index].textContent += stat.ft;
          rebContainer[index].textContent += stat.reb;
          astContainer[index].textContent += stat.ast;
          stlContainer[index].textContent += stat.stl;
          blkContainer[index].textContent += stat.blk;
          updateMax();
        })
        .catch(err => console.error(err));
    }

    function updateMax() {
      var ptArr = [];
      var fgArr = [];
      var fg3Arr = [];
      var ftArr = [];
      var rebArr = [];
      var astArr = [];
      var stlArr = [];
      var blkArr = [];
      let stats = document.querySelectorAll(".stats");
      for (let i = 0; i < stats.length; i++) {
        let pts = stats[i].querySelector(".pts").textContent;
        let fg = stats[i].querySelector(".fg").textContent;
        let fg3 = stats[i].querySelector(".fg3").textContent;
        let ft = stats[i].querySelector(".ft").textContent;
        let reb = stats[i].querySelector(".reb").textContent;
        let ast = stats[i].querySelector(".ast").textContent;
        let stl = stats[i].querySelector(".stl").textContent;
        let blk = stats[i].querySelector(".blk").textContent;
        ptArr.push(pts);
        fgArr.push(fg);
        fg3Arr.push(fg3);
        ftArr.push(ft);
        rebArr.push(reb);
        astArr.push(ast);
        stlArr.push(stl);
        blkArr.push(blk);
      }

      var ArrayContainer = [
        ptArr,
        fgArr,
        fg3Arr,
        ftArr,
        rebArr,
        astArr,
        stlArr,
        blkArr
      ];
      let arrNum = [];
      for (let i = 0; i < ArrayContainer.length; i++) {
        let numbers = ArrayContainer[i].map(Number);
        arrNum.push(numbers);
      }

      var indexMax = [];
      for (let j = 0; j < arrNum.length; j++) {
        let max = Math.max(...arrNum[j]);
        index = arrNum[j].indexOf(max);
        indexMax.push(index);
      }

      let statCont = document.querySelectorAll(".aa");
      statCont.forEach(stat => {
        stat.classList.remove("max");
      });

      let ptCont = document.querySelectorAll(".pts");
      let fgCont = document.querySelectorAll(".fg");
      let fg3Cont = document.querySelectorAll(".fg3");
      let ftCont = document.querySelectorAll(".ft");
      let rebCont = document.querySelectorAll(".reb");
      let astCont = document.querySelectorAll(".ast");
      let stlCont = document.querySelectorAll(".stl");
      let blkCont = document.querySelectorAll(".blk");
      if (statCont.length > 0) {
        ptCont[indexMax[0]].classList.add("max");
        fgCont[indexMax[1]].classList.add("max");
        fg3Cont[indexMax[2]].classList.add("max");
        ftCont[indexMax[3]].classList.add("max");
        rebCont[indexMax[4]].classList.add("max");
        astCont[indexMax[5]].classList.add("max");
        stlCont[indexMax[6]].classList.add("max");
        blkCont[indexMax[7]].classList.add("max");
      } else {
        return;
      }
    }
  });
