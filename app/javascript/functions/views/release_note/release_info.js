export const arr_release_info = [
    {
        date: "2023-11-01",
        changes: [
            "リリース",
            "検索条件入力フォーム",
            "NCBIゲノムデータベースの作成",
            "blastn検索",
            "tblastn検索",
            "検索結果表示",
            "検索条件表示"
        ],
        details: [
            "初リリース。以下にリリース時の情報を記載する",
            "検索条件を入力する。項目は以下の7個。Job title、生育温度、Query配列、検索方法、BLAST検索方法、Identity、E value",
            "TEMPURAデータベースに登録されている生物種のうち40℃以上のもののfastaファイルをNCBI BLASTのmakeblastdbを用いて、ゲノムデータベースにした。",
            "NCBI BLASTの検索機能。塩基配列データベースを用いて、入力された塩基配列に相同性を有する塩基配列を調べる。",
            "NCBI BLASTの検索機能。塩基配列データベースをアミノ酸に変換して、入力されたアミノ酸配列に相同性を有するアミノ酸配列を調べる。",
            "blastの検索の結果得られた情報をTEMPURAデータベースの情報と合わせて表示する。項目は以下の11個。生物種名、分類、至適生育温度、遺伝子名、タンパク質名、長さ、E Value、相同性、ギャップ、bit_score、アライメント。",
            "入力された検索条件を検索結果のページに表示する"
        ]
    }, {
        date: "2023-11-17",
        changes: [
            "検索結果のフィルターの追加",
            "検索結果のソートの追加"
        ],
        details: [
            "検索結果の項目（bit_score、至適生育温度、相同性）の数値が一定以上or以下の結果のみを表示する。",
            "検索結果の項目（bit_score、至適生育温度、相同性、E value）の数値が昇順or降順となるように結果を表示する。なお、bit_scoreの降順のソートがデフォルトの表示順である。"
        ]
    }, {
        date: "2023-11-20",
        changes: [
            "検索条件入力フォームの改良",
            "リリースノートの追加",
            "アイコンの追加"
        ],
        details: [
            "検索結果のフィルターの追加に伴い、検索条件入力フォームでのフィルターの設定を廃止した。また、その他未実装の機能を非表示にした。",
            "新機能の更新履歴を確認できるようになった。",
            "アイコンを作成、追加した。アイコンをクリックしたら検索入力ページに遷移するようにした。アイコンは\"https://www.ac-illust.com/\"から保存したものを利用した。"
        ]
    }, {
        date: "2023-11-21",
        changes: [
            "E Valueによる検索結果のフィルターの追加",
            "フィルター入力画面での数値の単位の追加"
        ],
        details: [
            "E Valueを用いた検索結果のフィルターでは、乗数 (e-の右側の数値) も入力することで小さい値の入力も可能である。",
            "検索結果のフィルター入力画面で数値の単位 (生育温度は℃、相同性は%、E Valueはe-) が表示されるようになった。"
        ]
    }, {
        date: "2023-11-29",
        changes: [
            "検索結果のソート、フィルターの設定の自動保存"
        ],
        details: [
            "検索結果にかけるソート (並び替え) やフィルター (絞り込み) を自動で保存できるようにした。この設定は検索結果画面内の設定アイコンの設定画面から変更可能である。<br>自動保存の設定の場合、次回以降の検索時やページ再読み込み時にも保存された設定が適用される。"
        ]
    }, {
        date: "2023-12-14",
        changes: [
            "新たな検索結果の表示形式の追加"
        ],
        details: [
            "ペアワイズアライメントのない検索結果の表示形式を追加した。この表示形式は生物情報とタンパク質名、アライメントのEvalue、相同性、bit scoreのみが表になって記載されており、ペアワイズアライメントが併記された表示形式より各種情報の視認性が向上した。この表示形式は、設定アイコン>「結果表示形式の変更」タブから変更可能。この設定も自動保存するか否かを設定可能である。"
        ]
    }, {
        date: "2023-12-15",
        changes: [
            "検索結果の生物種と菌株に参照リンクを追加"
        ],
        details: [
            "検索でヒットした配列の宿主の生物種名と菌株名に対し、それぞれNCBIのtaxonomy idとgenome assemblyのページのリンクを設定した。このリンクをクリックすると別タブで表示されるようになっている。"
        ]
    }
]